"""Request helpers: session scope, body parsing, authentication, pagination.

Starlette has no dependency-injection system, so handlers take the ``Request``
and call these helpers explicitly. This keeps control flow visible and makes
handlers straightforward to test.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any, TypeVar

from pydantic import BaseModel
from pydantic import ValidationError as PydanticValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.domain.models import ROLE_ADMIN, STAFF_ROLES, User
from app.errors import ForbiddenError, UnauthorizedError, ValidationError
from app.utils.pagination import clamp_limit
from app.utils.security import decode_access_token

TModel = TypeVar("TModel", bound=BaseModel)


@asynccontextmanager
async def db_session(request: Request) -> AsyncIterator[AsyncSession]:
    async with request.app.state.sessionmaker() as session:
        yield session


def client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def user_agent(request: Request) -> str | None:
    ua = request.headers.get("user-agent")
    return ua[:255] if ua else None


def _format_errors(exc: PydanticValidationError) -> list[dict[str, Any]]:
    return [
        {"field": ".".join(str(part) for part in err["loc"]), "message": err["msg"]}
        for err in exc.errors()
    ]


async def read_json(request: Request, schema: type[TModel]) -> TModel:
    """Parse and validate a JSON body, raising a problem+json 422 on failure."""
    try:
        raw = await request.json()
    except Exception as exc:  # noqa: BLE001 - any decode failure is a 422
        raise ValidationError("Request body must be valid JSON.") from exc
    if not isinstance(raw, dict):
        raise ValidationError("Request body must be a JSON object.")
    try:
        return schema.model_validate(raw)
    except PydanticValidationError as exc:
        raise ValidationError("One or more fields are invalid.", errors=_format_errors(exc)) from exc


def bearer_token(request: Request) -> str | None:
    header = request.headers.get("authorization", "")
    if not header.lower().startswith("bearer "):
        return None
    token = header[7:].strip()
    return token or None


async def optional_user(request: Request, session: AsyncSession) -> User | None:
    token = bearer_token(request)
    if not token:
        return None
    payload = decode_access_token(token)
    user = await session.get(User, payload.get("sub"))
    if user is None or not user.is_active:
        return None
    return user


async def current_user(request: Request, session: AsyncSession) -> User:
    token = bearer_token(request)
    if not token:
        raise UnauthorizedError("A bearer access token is required.")
    payload = decode_access_token(token)
    user = await session.get(User, payload.get("sub"))
    if user is None or not user.is_active:
        raise UnauthorizedError("Account not found or inactive.")
    return user


async def require_role(request: Request, session: AsyncSession, *roles: str) -> User:
    """Require the authenticated user to hold one of ``roles``.

    The single authorization choke point: routes call this instead of checking
    ``user.role`` themselves, so the role matrix lives in one place.
    """
    user = await current_user(request, session)
    if user.role not in roles:
        raise ForbiddenError("Your role does not permit this action.")
    return user


async def require_staff(request: Request, session: AsyncSession) -> User:
    """Any staff member (reception, therapist or admin)."""
    return await require_role(request, session, *STAFF_ROLES)


async def require_admin(request: Request, session: AsyncSession) -> User:
    user = await require_role(request, session, ROLE_ADMIN)
    return user


def pagination(request: Request, default_limit: int = 20) -> tuple[int, int]:
    try:
        limit = clamp_limit(int(request.query_params.get("limit", default_limit)), default_limit)
    except ValueError:
        limit = default_limit
    try:
        offset = max(0, int(request.query_params.get("offset", 0)))
    except ValueError:
        offset = 0
    return limit, offset
