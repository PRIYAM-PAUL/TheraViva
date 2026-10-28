"""Load authored catalog content from ``content.json`` into the database.

``content.json`` is generated from the frontend's ``src/data/*`` by
``scripts/export_frontend_data.mjs`` so the site content has a single source of
truth. Seeding is idempotent: items are upserted by (kind, slug).
"""

from __future__ import annotations

import json
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import CatalogItem
from app.domain.services import catalog as catalog_service

SEED_FILE = Path(__file__).with_name("content.json")


def _items(payload: dict) -> list[tuple[str, str, str, str | None, int, dict]]:
    """Yield (kind, slug, title, discipline, sort_order, data) tuples."""
    out: list[tuple[str, str, str, str | None, int, dict]] = []

    for index, item in enumerate(payload.get("services", [])):
        out.append(("service", item["slug"], item["title"], item.get("discipline"), index, item))
    for index, item in enumerate(payload.get("professionals", [])):
        out.append(("professional", item["slug"], item["name"], None, index, item))
    for index, item in enumerate(payload.get("conditions", [])):
        out.append(("condition", item["slug"], item["title"], None, index, item))
    for index, item in enumerate(payload.get("disciplines", [])):
        out.append(("discipline", item["id"], item["title"], item.get("id"), index, item))
    for index, item in enumerate(payload.get("faqs", [])):
        out.append(("faq", f"faq-{index + 1}", item["question"], None, index, item))
    for index, item in enumerate(payload.get("blog", [])):
        out.append(("blog_post", item["slug"], item["title"], None, index, item))
    for index, item in enumerate(payload.get("locations", [])):
        out.append(("location", item["slug"], item["name"], None, index, item))
    for index, item in enumerate(payload.get("pricing", [])):
        out.append(("pricing_package", item["id"], item["name"], None, index, item))
    return out


async def seed_catalog(session: AsyncSession, *, force: bool = False) -> int:
    """Seed catalog rows from ``content.json``. Returns the number of items."""
    if not SEED_FILE.exists():
        return 0
    payload = json.loads(SEED_FILE.read_text(encoding="utf-8"))

    if not force:
        existing = await session.scalar(select(func.count()).select_from(CatalogItem))
        if existing:
            return 0

    count = 0
    for kind, slug, title, discipline, sort_order, data in _items(payload):
        await catalog_service.upsert_item(
            session,
            kind=kind,
            slug=slug,
            title=title,
            data=data,
            discipline=discipline,
            sort_order=sort_order,
        )
        count += 1
    await session.commit()
    return count
