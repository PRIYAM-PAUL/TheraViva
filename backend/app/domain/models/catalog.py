"""Catalog content.

Catalog entities (services, professionals, conditions, …) are authored content
that mirrors the frontend's ``src/data/*`` objects. They are stored as one
discriminated table with a JSON payload: content is read-mostly, has no
relational integrity requirements between rows, and benefits from schema
flexibility. Scalar columns are lifted out only where the API filters or sorts
on them (``kind``, ``slug``, ``discipline``, ``title``).
"""

from __future__ import annotations

from sqlalchemy import Boolean, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.domain.models.base import Base, TimestampMixin

#: Valid ``kind`` values. The first six are seeded from the frontend.
CATALOG_KINDS = (
    "service",
    "professional",
    "condition",
    "discipline",
    "faq",
    "blog_post",
    "location",
    "pricing_package",
)


class CatalogItem(Base, TimestampMixin):
    __tablename__ = "catalog_items"
    __table_args__ = (UniqueConstraint("kind", "slug"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    kind: Mapped[str] = mapped_column(String(32), index=True)
    slug: Mapped[str] = mapped_column(String(96), index=True)
    title: Mapped[str] = mapped_column(String(200))
    discipline: Mapped[str | None] = mapped_column(String(48), nullable=True, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    published: Mapped[bool] = mapped_column(Boolean, default=True)
    data: Mapped[dict] = mapped_column(JSON, default=dict)
