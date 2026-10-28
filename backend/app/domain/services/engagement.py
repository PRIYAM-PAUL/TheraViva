"""Engagement analytics and SEO snapshot storage/aggregation."""

from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.api.deps import client_ip
from app.api.schemas.engagement import EngagementEventIn, SeoSnapshotIn
from app.domain.models import ENGAGEMENT_EVENT_TYPES, EngagementEvent, SeoSnapshot, utcnow
from app.errors import ValidationError
from app.utils.hashing import hash_ip


async def record_event(
    session: AsyncSession, payload: EngagementEventIn, request: Request
) -> EngagementEvent:
    if payload.event_type not in ENGAGEMENT_EVENT_TYPES:
        raise ValidationError(f"Unknown event type '{payload.event_type}'.")
    event = EngagementEvent(
        id=str(uuid.uuid4()),
        event_type=payload.event_type,
        path=payload.path,
        session_id=payload.session_id,
        referrer=payload.referrer,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        device=payload.device,
        meta=payload.meta,
        ip_hash=hash_ip(client_ip(request)),
        created_at=utcnow(),
    )
    session.add(event)
    return event


async def record_seo(session: AsyncSession, payload: SeoSnapshotIn) -> SeoSnapshot:
    snapshot = SeoSnapshot(
        id=str(uuid.uuid4()),
        snapshot_date=payload.snapshot_date,
        page=payload.page,
        impressions=payload.impressions,
        clicks=payload.clicks,
        ctr=payload.ctr,
        position=payload.position,
        source=payload.source,
        created_at=utcnow(),
    )
    session.add(snapshot)
    return snapshot


async def engagement_by_day(
    session: AsyncSession, start: datetime, end: datetime, event_type: str | None = None
) -> list[dict]:
    day = func.date(EngagementEvent.created_at).label("day")
    stmt = (
        select(day, func.count().label("value"))
        .where(EngagementEvent.created_at >= start, EngagementEvent.created_at <= end)
        .group_by(day)
        .order_by(day)
    )
    if event_type:
        stmt = stmt.where(EngagementEvent.event_type == event_type)
    rows = await session.execute(stmt)
    return [{"day": row.day, "value": float(row.value)} for row in rows.all()]


async def top_pages(session: AsyncSession, start: datetime, end: datetime, limit: int = 10) -> list[dict]:
    stmt = (
        select(EngagementEvent.path, func.count().label("views"))
        .where(
            EngagementEvent.created_at >= start,
            EngagementEvent.created_at <= end,
            EngagementEvent.event_type == "page_view",
            EngagementEvent.path.is_not(None),
        )
        .group_by(EngagementEvent.path)
        .order_by(func.count().desc())
        .limit(limit)
    )
    rows = await session.execute(stmt)
    return [{"path": row.path, "views": int(row.views)} for row in rows.all()]


async def seo_summary(session: AsyncSession, start: date, end: date) -> dict:
    row = (
        await session.execute(
            select(
                func.coalesce(func.sum(SeoSnapshot.impressions), 0),
                func.coalesce(func.sum(SeoSnapshot.clicks), 0),
                func.coalesce(func.avg(SeoSnapshot.ctr), 0.0),
                func.coalesce(func.avg(SeoSnapshot.position), 0.0),
            ).where(SeoSnapshot.snapshot_date >= start, SeoSnapshot.snapshot_date <= end)
        )
    ).one()
    impressions, clicks, ctr, position = int(row[0]), int(row[1]), float(row[2]), float(row[3])

    pages = (
        await session.execute(
            select(
                SeoSnapshot.page,
                func.sum(SeoSnapshot.impressions),
                func.sum(SeoSnapshot.clicks),
            )
            .where(SeoSnapshot.snapshot_date >= start, SeoSnapshot.snapshot_date <= end)
            .group_by(SeoSnapshot.page)
            .order_by(func.sum(SeoSnapshot.clicks).desc())
            .limit(10)
        )
    ).all()
    return {
        "impressions": impressions,
        "clicks": clicks,
        "ctr": round(ctr, 4),
        "average_position": round(position, 2),
        "top_pages": [
            {"page": page, "impressions": int(imp), "clicks": int(clicks_)} for page, imp, clicks_ in pages
        ],
    }


async def counts_by_type(session: AsyncSession, start: datetime, end: datetime) -> dict[str, int]:
    rows = await session.execute(
        select(EngagementEvent.event_type, func.count())
        .where(EngagementEvent.created_at >= start, EngagementEvent.created_at <= end)
        .group_by(EngagementEvent.event_type)
    )
    return {event_type: int(count) for event_type, count in rows.all()}
