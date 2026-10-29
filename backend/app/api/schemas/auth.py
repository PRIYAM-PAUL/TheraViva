"""Authentication schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.api.schemas.base import APIModel


class OtpRequestBody(APIModel):
    phone: str = Field(min_length=7, max_length=20)


class OtpRequestResult(APIModel):
    sent: bool
    expires_in_seconds: int
    #: Only populated outside production so the console flow stays testable.
    dev_code: str | None = None


class OtpVerifyBody(APIModel):
    phone: str = Field(min_length=7, max_length=20)
    code: str = Field(min_length=4, max_length=8)
    name: str | None = Field(default=None, max_length=120)


class StaffLoginBody(APIModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=6, max_length=200)


class RefreshBody(APIModel):
    refresh_token: str = Field(min_length=10)


class UserOut(APIModel):
    id: str
    role: str
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    is_active: bool
    created_at: datetime


class TokenPair(APIModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class StaffUserCreate(APIModel):
    """Admin creates a staff account (reception, therapist or admin)."""

    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=200)
    role: str = Field(pattern="^(reception|therapist|admin)$")
    name: str | None = Field(default=None, max_length=120)


class StaffUserUpdate(APIModel):
    name: str | None = Field(default=None, max_length=120)
    role: str | None = Field(default=None, pattern="^(reception|therapist|admin)$")
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=8, max_length=200)
