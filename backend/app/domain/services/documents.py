"""Documents (prescription and report uploads).

Uploads are stored through the configured ``Storage`` provider and indexed by a
``Document`` row. Access is scoped: a patient sees only their own documents,
staff see every document.

.. note::
    **Future AI analysis (not implemented).** A later phase will add OCR plus an
    LLM summary of an uploaded prescription (extracted medicines, dosage, and a
    plain-language explanation). That belongs behind a dedicated service and an
    explicit, consented flow — this module intentionally only stores and serves
    the raw file today. Do not add model calls here without that design.
"""

from __future__ import annotations

import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Document, User, utcnow
from app.errors import NotFoundError, ValidationError
from app.providers.registry import get_storage

#: Accepted upload types. Prescriptions arrive as scans/photos or PDFs.
ALLOWED_MIME = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/heif",
}
ALLOWED_KINDS = ("prescription", "report", "invoice", "other")
MAX_BYTES = 10 * 1024 * 1024  # 10 MB


async def create_document(
    session: AsyncSession,
    *,
    owner_user_id: str | None,
    appointment_id: str | None,
    kind: str,
    filename: str,
    mime: str | None,
    data: bytes,
) -> Document:
    if kind not in ALLOWED_KINDS:
        raise ValidationError(f"Unsupported document kind '{kind}'.")
    if mime and mime not in ALLOWED_MIME:
        raise ValidationError("Upload a PDF or an image (PNG, JPEG, WEBP, HEIC).")
    if not data:
        raise ValidationError("The uploaded file is empty.")
    if len(data) > MAX_BYTES:
        raise ValidationError("Files must be 10 MB or smaller.")

    safe_name = (filename or "upload").replace("/", "_").replace("\\", "_")[:200]
    key = f"documents/{owner_user_id or 'anonymous'}/{uuid.uuid4().hex}/{safe_name}"
    stored_key = await get_storage().put(key, data, mime or "application/octet-stream")

    document = Document(
        id=str(uuid.uuid4()),
        owner_user_id=owner_user_id,
        appointment_id=appointment_id,
        kind=kind,
        filename=safe_name,
        storage_key=stored_key,
        mime=mime,
        size_bytes=len(data),
        created_at=utcnow(),
    )
    session.add(document)
    return document


async def get_document(session: AsyncSession, document_id: str) -> Document:
    document = await session.get(Document, document_id)
    if document is None:
        raise NotFoundError("Document not found.")
    return document


async def read_bytes(document: Document) -> bytes:
    return await get_storage().get(document.storage_key)


async def list_documents(
    session: AsyncSession,
    *,
    owner_user_id: str | None = None,
    kind: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[Sequence[Document], int]:
    stmt = select(Document)
    if owner_user_id:
        stmt = stmt.where(Document.owner_user_id == owner_user_id)
    if kind:
        stmt = stmt.where(Document.kind == kind)
    stmt = stmt.order_by(Document.created_at.desc())
    rows = (await session.scalars(stmt.limit(limit).offset(offset))).all()
    # A small, single-page listing is enough for now; total mirrors the page.
    return rows, len(rows)


def can_access(document: Document, user: User, *, staff: bool) -> bool:
    if staff:
        return True
    return document.owner_user_id == user.id
