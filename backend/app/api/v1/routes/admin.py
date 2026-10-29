"""Admin routes: intake management, users and the audit log."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import db_session, pagination, read_json, require_admin, require_role, require_staff
from app.api.responses import json_response, orm_to_dict, page_payload
from app.api.schemas.auth import StaffUserCreate, StaffUserUpdate
from app.api.schemas.intake import IntakeStatusUpdate
from app.domain.models import ROLE_ADMIN, ROLE_PATIENT, ROLE_RECEPTION, STAFF_ROLES, AuditLog, User
from app.domain.services import audit as audit_service
from app.domain.services import intake as intake_service
from app.errors import ConflictError, NotFoundError, ValidationError
from app.utils.security import hash_password


async def list_intake(request: Request) -> Response:
    kind = request.path_params["kind"]
    status = request.query_params.get("status")
    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_role(request, session, ROLE_ADMIN, ROLE_RECEPTION)
        records, total = await intake_service.list_intake(
            session, kind, status=status, limit=limit, offset=offset
        )
        return json_response(page_payload([orm_to_dict(r) for r in records], total, limit, offset))


async def update_intake_status(request: Request) -> Response:
    kind = request.path_params["kind"]
    record_id = request.path_params["record_id"]
    body = await read_json(request, IntakeStatusUpdate)
    async with db_session(request) as session:
        admin = await require_role(request, session, ROLE_ADMIN, ROLE_RECEPTION)
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


def _user_payload(row: User) -> dict:
    data = orm_to_dict(row)
    data.pop("passwordHash", None)
    return data


async def list_patients(request: Request) -> Response:
    """Patient accounts, visible to any staff member."""
    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_staff(request, session)
        rows = (
            await session.scalars(
                select(User)
                .where(User.role == ROLE_PATIENT)
                .order_by(User.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        ).all()
        total = len(rows)
        return json_response(page_payload([_user_payload(row) for row in rows], total, limit, offset))


async def create_user(request: Request) -> Response:
    """Admin creates a staff account (reception, therapist or admin)."""
    body = await read_json(request, StaffUserCreate)
    async with db_session(request) as session:
        admin = await require_admin(request, session)
        email = body.email.lower()
        existing = await session.scalar(select(User).where(User.email == email))
        if existing is not None:
            raise ConflictError("An account with that email already exists.")
        user = User(
            id=str(uuid.uuid4()),
            role=body.role,
            email=email,
            name=body.name,
            password_hash=hash_password(body.password),
            is_active=True,
        )
        session.add(user)
        await session.flush()
        await audit_service.record(
            session,
            action="user.created",
            entity_type="user",
            entity_id=user.id,
            actor=admin,
            after={"role": user.role, "email": user.email},
            request=request,
        )
        await session.commit()
        await session.refresh(user)
        return json_response(_user_payload(user), status_code=201)


async def update_user(request: Request) -> Response:
    """Admin edits a user's name, role, active flag or password."""
    user_id = request.path_params["user_id"]
    body = await read_json(request, StaffUserUpdate)
    async with db_session(request) as session:
        admin = await require_admin(request, session)
        user = await session.get(User, user_id)
        if user is None:
            raise NotFoundError("User not found.")
        before = {"role": user.role, "is_active": user.is_active}
        if body.name is not None:
            user.name = body.name
        if body.role is not None:
            if user.role not in STAFF_ROLES:
                raise ValidationError("Only staff accounts can be given a staff role.")
            user.role = body.role
        if body.is_active is not None:
            if user.id == admin.id and body.is_active is False:
                raise ValidationError("You cannot deactivate your own account.")
            user.is_active = body.is_active
        if body.password:
            user.password_hash = hash_password(body.password)
        await audit_service.record(
            session,
            action="user.updated",
            entity_type="user",
            entity_id=user.id,
            actor=admin,
            before=before,
            after={"role": user.role, "is_active": user.is_active},
            request=request,
        )
        await session.commit()
        await session.refresh(user)
        return json_response(_user_payload(user))
