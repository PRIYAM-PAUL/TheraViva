"""Catalog schemas."""

from __future__ import annotations

from app.api.schemas.base import APIModel


class CatalogItemOut(APIModel):
    id: str
    kind: str
    slug: str
    title: str
    discipline: str | None = None
    sort_order: int
    published: bool
    #: The authored payload (description, prices, body, …), mirroring src/data.
    data: dict
