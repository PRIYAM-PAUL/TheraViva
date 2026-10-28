"""Catalog routes (public reads + admin writes).

The public API exposes both a generic ``/catalog/{kind}`` collection and
friendly aliases (``/services``, ``/conditions``, …) built from the same
handlers.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from pydantic import Field
from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import db_session, pagination, read_json, require_admin
from app.api.responses import json_response
from app.api.schemas.base import APIModel
from app.api.schemas.catalog import CatalogItemOut
from app.api.schemas.common import PageOut
from app.domain.models import CATALOG_KINDS, CatalogItem
from app.domain.services import catalog as catalog_service
from app.errors import NotFoundError
from app.utils.pagination import Page


class _UpsertBody(APIModel):
    title: str = Field(min_length=1, max_length=200)
    data: dict = Field(default_factory=dict)
    discipline: str | None = None
    sort_order: int = 0
    published: bool = True


def _to_out(item: CatalogItem) -> CatalogItemOut:
    return CatalogItemOut(
        id=item.id,
        kind=item.kind,
        slug=item.slug,
        title=item.title,
        discipline=item.discipline,
        sort_order=item.sort_order,
        published=item.published,
        data=item.data or {},
    )


async def list_all(request: Request) -> Response:
    """Every catalog kind in one payload (site bootstrap)."""
    async with db_session(request) as session:
        grouped: dict[str, Any] = {}
        for kind in CATALOG_KINDS:
            items, _ = await catalog_service.list_items(session, kind, limit=500)
            grouped[kind] = [_to_out(item) for item in items]
    return json_response(grouped)


async def _list(request: Request, kind: str) -> Response:
    discipline = request.query_params.get("discipline")
    limit, offset = pagination(request, default_limit=100)
    async with db_session(request) as session:
        items, total = await catalog_service.list_items(
            session, kind, discipline=discipline, limit=limit, offset=offset
        )
        page: Page = Page(items=[_to_out(item) for item in items], total=total, limit=limit, offset=offset)
    return json_response(
        PageOut[CatalogItemOut](
            items=page.items, total=page.total, limit=page.limit, offset=page.offset, has_more=page.has_more
        )
    )


async def _get(request: Request, kind: str, slug: str) -> Response:
    async with db_session(request) as session:
        item = await catalog_service.get_item(session, kind, slug)
        if item is None:
            raise NotFoundError(f"No {kind} with slug '{slug}'.")
        return json_response(_to_out(item))


async def list_kind(request: Request) -> Response:
    return await _list(request, request.path_params["kind"])


async def get_item(request: Request) -> Response:
    return await _get(request, request.path_params["kind"], request.path_params["slug"])


def make_list_handler(kind: str) -> Callable:
    async def handler(request: Request) -> Response:
        return await _list(request, kind)

    handler.__name__ = f"list_{kind}"
    return handler


def make_get_handler(kind: str) -> Callable:
    async def handler(request: Request) -> Response:
        return await _get(request, kind, request.path_params["slug"])

    handler.__name__ = f"get_{kind}"
    return handler


# --- Admin -----------------------------------------------------------------
async def upsert_item(request: Request) -> Response:
    kind = request.path_params["kind"]
    slug = request.path_params["slug"]
    body = await read_json(request, _UpsertBody)
    async with db_session(request) as session:
        await require_admin(request, session)
        item = await catalog_service.upsert_item(
            session,
            kind=kind,
            slug=slug,
            title=body.title,
            data=body.data,
            discipline=body.discipline,
            sort_order=body.sort_order,
            published=body.published,
        )
        await session.commit()
        await session.refresh(item)
        return json_response(_to_out(item))


async def delete_item(request: Request) -> Response:
    kind = request.path_params["kind"]
    slug = request.path_params["slug"]
    async with db_session(request) as session:
        await require_admin(request, session)
        item = await catalog_service.get_item(session, kind, slug)
        if item is None:
            raise NotFoundError(f"No {kind} with slug '{slug}'.")
        await session.delete(item)
        await session.commit()
    return Response(status_code=204)
