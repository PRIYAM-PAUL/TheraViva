"""Authentication routes."""

from __future__ import annotations

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import current_user, db_session, read_json
from app.api.responses import json_response
from app.api.schemas.auth import (
    OtpRequestBody,
    OtpRequestResult,
    OtpVerifyBody,
    RefreshBody,
    StaffLoginBody,
    TokenPair,
    UserOut,
)
from app.domain.models import User
from app.domain.services import auth as auth_service


def user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        role=user.role,
        name=user.name,
        email=user.email,
        phone=user.phone,
        is_active=user.is_active,
        created_at=user.created_at,
    )


def _token_pair(user: User, access: str, refresh: str, expires_in: int) -> TokenPair:
    return TokenPair(
        access_token=access,
        refresh_token=refresh,
        token_type="bearer",
        expires_in=expires_in,
        user=user_out(user),
    )


async def otp_request(request: Request) -> Response:
    body = await read_json(request, OtpRequestBody)
    async with db_session(request) as session:
        expires_in, dev_code = await auth_service.request_otp(session, body.phone, request)
        await session.commit()
    return json_response(OtpRequestResult(sent=True, expires_in_seconds=expires_in, dev_code=dev_code))


async def otp_verify(request: Request) -> Response:
    body = await read_json(request, OtpVerifyBody)
    async with db_session(request) as session:
        user, access, refresh = await auth_service.verify_otp(
            session, body.phone, body.code, body.name, request
        )
    from app.config import settings

    return json_response(_token_pair(user, access, refresh, settings.access_token_minutes * 60))


async def staff_login(request: Request) -> Response:
    body = await read_json(request, StaffLoginBody)
    async with db_session(request) as session:
        user, access, refresh = await auth_service.staff_login(
            session, body.email, body.password, request
        )
    from app.config import settings

    return json_response(_token_pair(user, access, refresh, settings.access_token_minutes * 60))


async def token_refresh(request: Request) -> Response:
    body = await read_json(request, RefreshBody)
    async with db_session(request) as session:
        user, access, refresh = await auth_service.rotate_refresh(session, body.refresh_token, request)
    from app.config import settings

    return json_response(_token_pair(user, access, refresh, settings.access_token_minutes * 60))


async def logout(request: Request) -> Response:
    body = await read_json(request, RefreshBody)
    async with db_session(request) as session:
        await auth_service.revoke_refresh(session, body.refresh_token)
    return Response(status_code=204)


async def me(request: Request) -> Response:
    async with db_session(request) as session:
        user = await current_user(request, session)
        return json_response(user_out(user))
