"""Application lifespan: database setup, seeding and scheduler lifecycle."""

from __future__ import annotations

from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession
from starlette.applications import Starlette

from app.config import settings
from app.database import create_engine, create_sessionmaker
from app.domain.models import Base
from app.domain.services import auth as auth_service
from app.logging import configure_logging, get_logger
from app.seed.loader import seed_catalog

logger = get_logger("app.lifespan")


@asynccontextmanager
async def lifespan(app: Starlette):
    configure_logging("DEBUG" if settings.debug else "INFO")
    engine = create_engine(settings.database_url)
    app.state.engine = engine
    app.state.sessionmaker = create_sessionmaker(engine)

    if settings.auto_create_tables:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with app.state.sessionmaker() as session:
        seeded = await seed_catalog(session)
        if seeded:
            logger.info("catalog seeded", extra={"extra_fields": {"items": seeded}})
        await auth_service.ensure_admin_bootstrap(session)

    logger.info(
        "startup complete",
        extra={"extra_fields": {"env": settings.env, "database": settings.database_url.split("///")[-1]}},
    )
    try:
        yield
    finally:
        await engine.dispose()
        logger.info("shutdown complete")


def session_scope(app: Starlette) -> AsyncSession:
    """Return a new session bound to the app's engine (caller closes it)."""
    return app.state.sessionmaker()
