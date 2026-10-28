"""Seed the database from ``app/seed/content.json``.

Usage::

    python -m scripts.seed          # seed only if the catalog is empty
    python -m scripts.seed --force  # re-seed (upsert) regardless
"""

from __future__ import annotations

import argparse
import asyncio

from app.database import create_engine, create_sessionmaker
from app.domain.models import Base
from app.seed.loader import seed_catalog


async def main(force: bool) -> None:
    engine = create_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = create_sessionmaker(engine)
    async with session_factory() as session:
        count = await seed_catalog(session, force=force)
    await engine.dispose()
    print(f"Seeded {count} catalog items.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed TheraViva catalog content.")
    parser.add_argument("--force", action="store_true", help="Re-seed even if rows exist.")
    args = parser.parse_args()
    asyncio.run(main(args.force))
