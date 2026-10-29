"""Alembic environment.

Uses the application's ``DATABASE_URL`` and metadata so migrations always match
the models. ``render_as_batch`` (set in alembic.ini) is required for SQLite.
"""

from __future__ import annotations

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.config import settings
from app.domain.models import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def render_item(type_, obj, autogen_context):  # noqa: ANN001, ANN201
    """Render our custom ``UTCDateTime`` as a plain ``sa.DateTime``.

    Without this, Alembic emits ``app.domain.models.base.UTCDateTime()`` in the
    generated file, which fails at runtime unless the migration imports ``app``.
    """
    from app.domain.models.base import UTCDateTime

    if type_ == "type" and isinstance(obj, UTCDateTime):
        return "sa.DateTime()"
    return False


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        render_as_batch=True,
        compare_type=True,
        render_item=render_item,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:  # noqa: ANN001
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        render_as_batch=True,
        compare_type=True,
        render_item=render_item,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    engine = create_async_engine(settings.database_url, future=True)
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
