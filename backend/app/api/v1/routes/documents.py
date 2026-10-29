"""Document routes: prescription/report upload, listing and download.

Patients manage their own documents; staff can view (and upload on behalf of)
any patient. Files live in the storage provider, never in the database.
"""

from __future__ import annotations

from starlette.datastructures import UploadFile
from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import current_user, db_session, pagination
from app.api.responses import json_response, page_payload
from app.api.schemas.documents import DocumentOut
from app.domain.models import STAFF_ROLES, Document
from app.domain.services import documents as documents_service
from app.errors import ForbiddenError, NotFoundError, ValidationError

MAX_UPLOAD_FIELD = "file"


def _out(document: Document) -> DocumentOut:
    return DocumentOut(
        id=document.id,
        owner_user_id=document.owner_user_id,
        appointment_id=document.appointment_id,
        kind=document.kind,
        filename=document.filename,
        mime=document.mime,
        size_bytes=document.size_bytes,
        created_at=document.created_at,
    )


async def upload_document(request: Request) -> Response:
    form = await request.form()
    upload = form.get(MAX_UPLOAD_FIELD)
    if not isinstance(upload, UploadFile):
        raise ValidationError("Attach a file in the 'file' field.")
    data = await upload.read()
    kind = str(form.get("kind") or "prescription")
    appointment_id = form.get("appointmentId")
    owner_override = form.get("ownerUserId")

    async with db_session(request) as session:
        user = await current_user(request, session)
        is_staff = user.role in STAFF_ROLES
        # Only staff may upload on someone else's behalf.
        owner_user_id = user.id
        if owner_override and is_staff:
            owner_user_id = str(owner_override)
        document = await documents_service.create_document(
            session,
            owner_user_id=owner_user_id,
            appointment_id=str(appointment_id) if appointment_id else None,
            kind=kind,
            filename=upload.filename or "upload",
            mime=upload.content_type,
            data=data,
        )
        await session.commit()
        await session.refresh(document)
        return json_response(_out(document), status_code=201)


async def list_documents(request: Request) -> Response:
    limit, offset = pagination(request)
    kind = request.query_params.get("kind")
    owner = request.query_params.get("ownerUserId")
    async with db_session(request) as session:
        user = await current_user(request, session)
        is_staff = user.role in STAFF_ROLES
        if not is_staff and owner and owner != user.id:
            raise ForbiddenError("You can only view your own documents.")
        scoped_owner = None if is_staff and not owner else (owner or user.id)
        rows, total = await documents_service.list_documents(
            session, owner_user_id=scoped_owner, kind=kind, limit=limit, offset=offset
        )
        return json_response(page_payload([_out(r) for r in rows], total, limit, offset))


async def download_document(request: Request) -> Response:
    document_id = request.path_params["document_id"]
    async with db_session(request) as session:
        user = await current_user(request, session)
        is_staff = user.role in STAFF_ROLES
        document = await documents_service.get_document(session, document_id)
        if not documents_service.can_access(document, user, staff=is_staff):
            raise NotFoundError("Document not found.")
        data = await documents_service.read_bytes(document)
    filename = document.filename.replace('"', "")
    return Response(
        content=data,
        media_type=document.mime or "application/octet-stream",
        headers={
            "Content-Disposition": f'inline; filename="{filename}"',
            "Cache-Control": "private, no-store",
        },
    )
