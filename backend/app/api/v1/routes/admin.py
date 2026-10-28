"""Admin routes: intake management, users and the audit log."""

from __future__ import annotations

from sqlalchemy import select
from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import db_session, pagination, read_json, require_admin
from app.api.responses import json_response, orm_to_dict, page_payload
from app.api.schemas.intake import IntakeStatusUpdate
from app.domain.models import AuditLog, User
from app.domain.services import audit as audit_service
from app.domain.services import intake as intake_service


async def list_intake(request: Request) -> Response:
    kind = request.path_params["kind"]
    status = request.query_params.get("status")
    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_admin(request, session)
        records, total = await intake_service.list_intake(
            session, kind, status=status, limit=limit, offset=offset
        )
        return json_response(page_payload([orm_to_dict(r) for r in records], total, limit, offset))


async def update_intake_status(request: Request) -> Response:
    kind = request.path_params["kind"]
    record_id = request.path_params["record_id"]
    body = await read_json(request, IntakeStatusUpdate)
    async with db_session(request) as session:
        admin = await require_admin(request, session)
        record = await intake_service.update_status(session, kind, record_id, body.status)
        await audit_service.record(
            session,
            action="intake.status_changed",
            entity_type=kind,
            entity_id=record_id,
            actor=admin,
            after={"status": body.status},
            request=request,
        )
        await session.commit()
        await session.refresh(record)
        return json_response(orm_to_dict(record))


async def list_audit_log(request: Request) -> Response:
    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_admin(request, session)
        rows = (
            await session.scalars(
                select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).offset(offset)
            )
        ).all()
        total = len(rows)
        return json_response(page_payload([orm_to_dict(r) for r in rows], total, limit, offset))


async def list_users(request: Request) -> Response:
    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_admin(request, session)
        rows = (
            await session.scalars(
                select(User).order_by(User.created_at.desc()).limit(limit).offset(offset)
            )
        ).all()
        total = len(rows)
        # Never expose password hashes.
        payload = []
        for row in rows:
            data = orm_to_dict(row)
            data.pop("passwordHash", None)
            payload.append(data)
        return json_response(page_payload(payload, total, limit, offset))
