"""Catalog queries and seeding."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import CATALOG_KINDS, CatalogItem
from app.errors import ValidationError
from app.utils.pagination import paginate


def _validate_kind(kind: str) -> str:
    if kind not in CATALOG_KINDS:
        raise ValidationError(f"Unknown catalog kind '{kind}'.")
    return kind


async def list_items(
    session: AsyncSession,
    kind: str,
    *,
    discipline: str | None = None,
    published_only: bool = True,
    limit: int = 100,
    offset: int = 0,
) -> tuple[list[CatalogItem], int]:
    _validate_kind(kind)
    stmt = select(CatalogItem).where(CatalogItem.kind == kind)
    if discipline:
        stmt = stmt.where(CatalogItem.discipline == discipline)
    if published_only:
        stmt = stmt.where(CatalogItem.published.is_(True))
    stmt = stmt.order_by(CatalogItem.sort_order, CatalogItem.title)
    items, total = await paginate(session, stmt, limit=limit, offset=offset)
    return items, total


async def get_item(session: AsyncSession, kind: str, slug: str) -> CatalogItem | None:
    _validate_kind(kind)
    return await session.scalar(
        select(CatalogItem).where(CatalogItem.kind == kind, CatalogItem.slug == slug)
    )


async def get_by_id(session: AsyncSession, item_id: str) -> CatalogItem | None:
    return await session.get(CatalogItem, item_id)


async def exists(session: AsyncSession, kind: str, slug: str) -> bool:
    return (
        await session.scalar(
            select(func.count())
            .select_from(CatalogItem)
            .where(CatalogItem.kind == kind, CatalogItem.slug == slug)
        )
        or 0
    ) > 0


async def upsert_item(
    session: AsyncSession,
    *,
    kind: str,
    slug: str,
    title: str,
    data: dict,
    discipline: str | None = None,
    sort_order: int = 0,
    published: bool = True,
) -> CatalogItem:
    _validate_kind(kind)
    item = await get_item(session, kind, slug)
    if item is None:
        item = CatalogItem(
            id=f"{kind}:{slug}",
            kind=kind,
            slug=slug,
            title=title,
            discipline=discipline,
            sort_order=sort_order,
            published=published,
            data=data,
        )
        session.add(item)
    else:
        item.title = title
        item.data = data
        item.discipline = discipline
        item.sort_order = sort_order
        item.published = published
    return item


async def count_by_kind(session: AsyncSession) -> dict[str, int]:
    rows = await session.execute(
        select(CatalogItem.kind, func.count()).group_by(CatalogItem.kind)
    )
    return {kind: int(count) for kind, count in rows.all()}
