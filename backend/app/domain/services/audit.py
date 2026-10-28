"""Audit log recording."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.domain.models import AuditLog, User, utcnow
from app.logging import request_id_ctx
from app.utils.hashing import hash_ip


async def record(
    session: AsyncSession,
    *,
    action: str,
    entity_type: str,
    entity_id: str | None = None,
    actor: User | None = None,
    before: dict[str, Any] | None = None,
    after: dict[str, Any] | None = None,
    request: Request | None = None,
) -> None:
    """Append an immutable audit entry (does not commit)."""
    ip_hash = None
    if request is not None:
        from app.api.deps import client_ip

        ip_hash = hash_ip(client_ip(request))
    session.add(
        AuditLog(
            id=str(uuid.uuid4()),
            actor_user_id=actor.id if actor else None,
            actor_role=actor.role if actor else None,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            before=before,
            after=after,
            ip_hash=ip_hash,
            request_id=request_id_ctx.get(),
            created_at=utcnow(),
        )
    )
