"""Analytics routes: engagement event ingestion and SEO snapshots."""

from __future__ import annotations

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import db_session, pagination, read_json, require_admin
from app.api.responses import json_response, orm_to_dict, page_payload
from app.api.schemas.engagement import EngagementEventIn, SeoSnapshotIn
from app.domain.models import SeoSnapshot
from app.domain.services import engagement as engagement_service


async def record_event(request: Request) -> Response:
    """Public, unauthenticated, privacy-respecting engagement beacon."""
    body = await read_json(request, EngagementEventIn)
    async with db_session(request) as session:
        event = await engagement_service.record_event(session, body, request)
        await session.commit()
        return json_response({"id": event.id, "recorded": True}, status_code=202)


async def create_seo_snapshot(request: Request) -> Response:
    body = await read_json(request, SeoSnapshotIn)
    async with db_session(request) as session:
        await require_admin(request, session)
        snapshot = await engagement_service.record_seo(session, body)
        await session.commit()
        await session.refresh(snapshot)
        return json_response(orm_to_dict(snapshot), status_code=201)


async def list_seo_snapshots(request: Request) -> Response:
    from sqlalchemy import select

    limit, offset = pagination(request)
    async with db_session(request) as session:
        await require_admin(request, session)
        rows = (
            await session.scalars(
                select(SeoSnapshot).order_by(SeoSnapshot.snapshot_date.desc()).limit(limit).offset(offset)
            )
        ).all()
        total = len(rows)
        return json_response(page_payload([orm_to_dict(r) for r in rows], total, limit, offset))
