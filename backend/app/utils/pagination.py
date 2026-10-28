"""Offset pagination helpers."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, TypeVar

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")

MAX_LIMIT = 100


@dataclass
class Page(Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int

    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total


def clamp_limit(limit: int, default: int = 20) -> int:
    if limit <= 0:
        return default
    return min(limit, MAX_LIMIT)


async def paginate(
    session: AsyncSession, stmt: Select, *, limit: int, offset: int
) -> tuple[list, int]:
    total = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = (await session.scalars(stmt.limit(limit).offset(offset))).all()
    return list(rows), int(total or 0)
