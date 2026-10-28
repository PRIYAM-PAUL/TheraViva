"""Authentication: patient phone-OTP and admin password login.

Two roles only (``patient``, ``admin``). Access tokens are short-lived JWTs;
refresh tokens are opaque, stored hashed, and rotated on use.
"""

from __future__ import annotations

import re
import secrets
import uuid
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.api.deps import client_ip, user_agent
from app.config import settings
from app.domain.models import ROLE_ADMIN, ROLE_PATIENT, OtpChallenge, RefreshToken, User, utcnow
from app.domain.services import audit
from app.errors import UnauthorizedError, ValidationError
from app.logging import get_logger
from app.providers.registry import get_sms_sender
from app.utils.hashing import hash_ip
from app.utils.security import (
    create_access_token,
    hash_otp,
    hash_password,
    new_token,
    token_hash,
    verify_password,
)

logger = get_logger("app.auth")

_PHONE_STRIP = re.compile(r"[^\d+]")


def normalize_phone(phone: str) -> str:
    cleaned = _PHONE_STRIP.sub("", phone.strip())
    if len(re.sub(r"\D", "", cleaned)) < 7:
        raise ValidationError("Please enter a valid phone number.")
    return cleaned


async def ensure_admin_bootstrap(session: AsyncSession) -> None:
    """Create the bootstrap admin from settings if no admin exists yet."""
    existing = await session.scalar(select(User).where(User.role == ROLE_ADMIN).limit(1))
    if existing:
        return
    admin = User(
        id=str(uuid.uuid4()),
        role=ROLE_ADMIN,
        email=settings.admin_email.lower(),
        name=settings.admin_name,
        password_hash=hash_password(settings.admin_password),
        is_active=True,
    )
    session.add(admin)
    await session.commit()
    logger.info("bootstrap admin created", extra={"extra_fields": {"email": admin.email}})


# --- OTP -------------------------------------------------------------------
async def request_otp(session: AsyncSession, phone: str, request: Request) -> tuple[int, str | None]:
    normalized = normalize_phone(phone)
    is_dev = not settings.is_production
    code = settings.otp_dev_code if is_dev else f"{secrets.randbelow(1_000_000):06d}"

    challenge = OtpChallenge(
        id=str(uuid.uuid4()),
        phone=normalized,
        code_hash="",
        purpose="login",
        attempts=0,
        expires_at=utcnow() + timedelta(minutes=settings.otp_ttl_minutes),
        created_at=utcnow(),
    )
    challenge.code_hash = hash_otp(code, challenge.id)
    session.add(challenge)

    await get_sms_sender().send(to=normalized, text=f"Your TheraViva code is {code}")

    await audit.record(
        session, action="otp.requested", entity_type="otp", entity_id=challenge.id, request=request
    )
    return settings.otp_ttl_minutes * 60, (code if is_dev else None)


async def verify_otp(
    session: AsyncSession, phone: str, code: str, name: str | None, request: Request
) -> tuple[User, str, str]:
    normalized = normalize_phone(phone)
    challenge = await session.scalar(
        select(OtpChallenge)
        .where(OtpChallenge.phone == normalized, OtpChallenge.consumed_at.is_(None))
        .order_by(OtpChallenge.created_at.desc())
        .limit(1)
    )
    if challenge is None:
        raise UnauthorizedError("No active code. Please request a new one.")
    if challenge.expires_at < utcnow():
        raise UnauthorizedError("This code has expired. Please request a new one.")
    if challenge.attempts >= settings.otp_max_attempts:
        raise UnauthorizedError("Too many attempts. Please request a new code.")

    challenge.attempts += 1
    if hash_otp(code, challenge.id) != challenge.code_hash:
        await session.commit()
        raise UnauthorizedError("That code is not correct.")
    challenge.consumed_at = utcnow()

    user = await session.scalar(select(User).where(User.phone == normalized))
    if user is None:
        user = User(
            id=str(uuid.uuid4()),
            role=ROLE_PATIENT,
            phone=normalized,
            name=name,
            is_active=True,
        )
        session.add(user)
    elif name and not user.name:
        user.name = name

    tokens = await _issue_tokens(session, user, request)
    await audit.record(session, action="auth.login", entity_type="user", entity_id=user.id, actor=user, request=request)
    return user, tokens[0], tokens[1]


# --- Staff login -----------------------------------------------------------
async def staff_login(
    session: AsyncSession, email: str, password: str, request: Request
) -> tuple[User, str, str]:
    user = await session.scalar(select(User).where(User.email == email.lower()))
    if user is None or user.role != ROLE_ADMIN or not verify_password(password, user.password_hash):
        # Uniform error to avoid revealing which accounts exist.
        raise UnauthorizedError("Email or password is incorrect.")
    if not user.is_active:
        raise UnauthorizedError("This account is disabled.")
    tokens = await _issue_tokens(session, user, request)
    await audit.record(
        session,
        action="auth.staff_login",
        entity_type="user",
        entity_id=user.id,
        actor=user,
        request=request,
    )
    return user, tokens[0], tokens[1]


# --- Refresh / revoke ------------------------------------------------------
async def _issue_tokens(session: AsyncSession, user: User, request: Request) -> tuple[str, str]:
    access = create_access_token(user.id, user.role)
    raw_refresh = new_token()
    session.add(
        RefreshToken(
            id=str(uuid.uuid4()),
            user_id=user.id,
            token_hash=token_hash(raw_refresh),
            expires_at=utcnow() + timedelta(days=settings.refresh_token_days),
            user_agent=user_agent(request),
            ip_hash=hash_ip(client_ip(request)),
            created_at=utcnow(),
        )
    )
    await session.commit()
    return access, raw_refresh


async def rotate_refresh(session: AsyncSession, raw_token: str, request: Request) -> tuple[User, str, str]:
    stored = await session.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash(raw_token))
    )
    if stored is None or stored.revoked_at is not None:
        raise UnauthorizedError("Refresh token is invalid.")
    if stored.expires_at < utcnow():
        raise UnauthorizedError("Refresh token has expired.")
    user = await session.get(User, stored.user_id)
    if user is None or not user.is_active:
        raise UnauthorizedError("Account not found or inactive.")

    stored.revoked_at = utcnow()
    access, refresh = await _issue_tokens(session, user, request)
    return user, access, refresh


async def revoke_refresh(session: AsyncSession, raw_token: str) -> None:
    stored = await session.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash(raw_token))
    )
    if stored is not None and stored.revoked_at is None:
        stored.revoked_at = utcnow()
        await session.commit()
