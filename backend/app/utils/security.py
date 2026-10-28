"""Security primitives: password hashing, JWTs and opaque tokens."""

from __future__ import annotations

import hashlib
import hmac
import secrets
import string
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from app.config import settings
from app.errors import UnauthorizedError

_hasher = PasswordHasher()
_ALPHABET = string.ascii_uppercase + string.digits
_TOKEN_BYTES = 32

ALGORITHM = "HS256"


# --- Passwords -------------------------------------------------------------
def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    try:
        return _hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


# --- Opaque tokens ---------------------------------------------------------
def new_token() -> str:
    """A high-entropy opaque token (used for refresh + action links)."""
    return secrets.token_urlsafe(_TOKEN_BYTES)


def token_hash(token: str) -> str:
    """Deterministic hash for storing tokens at rest."""
    return hashlib.sha256(f"{settings.secret_key}:{token}".encode()).hexdigest()


def hash_otp(code: str, salt: str) -> str:
    return hashlib.sha256(f"{settings.secret_key}:{salt}:{code}".encode()).hexdigest()


def constant_time_equal(a: str, b: str) -> bool:
    return hmac.compare_digest(a, b)


# --- References ------------------------------------------------------------
def new_reference(prefix: str = "TV") -> str:
    """A short, human-readable, non-sequential reference code."""
    body = "".join(secrets.choice(_ALPHABET) for _ in range(6))
    return f"{prefix}-{body}"


# --- JWT -------------------------------------------------------------------
def create_access_token(subject: str, role: str, extra: dict[str, Any] | None = None) -> str:
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "sub": subject,
        "role": role,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.access_token_minutes)).timestamp()),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError as exc:
        raise UnauthorizedError("Access token has expired.") from exc
    except jwt.InvalidTokenError as exc:
        raise UnauthorizedError("Access token is invalid.") from exc
    if payload.get("type") != "access":
        raise UnauthorizedError("Unexpected token type.")
    return payload
