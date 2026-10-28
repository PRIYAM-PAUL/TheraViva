"""Response helpers."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel
from starlette.responses import JSONResponse


def _dump(value: Any) -> Any:
    if isinstance(value, BaseModel):
        return value.model_dump(mode="json", by_alias=True)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, dict):
        return {key: _dump(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_dump(item) for item in value]
    return value


def json_response(data: Any, status_code: int = 200) -> JSONResponse:
    """Serialize Pydantic models (and nested structures) using camelCase aliases."""
    return JSONResponse(_dump(data), status_code=status_code)


def orm_to_dict(obj: Any) -> dict[str, Any]:
    """Convert a SQLAlchemy model instance to a camelCase dict of its columns."""
    from app.api.schemas.base import to_camel

    return {
        to_camel(column.key): _dump(getattr(obj, column.key))
        for column in obj.__table__.columns
    }


def page_payload(items: list[Any], total: int, limit: int, offset: int) -> dict[str, Any]:
    return {
        "items": _dump(items),
        "total": total,
        "limit": limit,
        "offset": offset,
        "hasMore": offset + len(items) < total,
    }
