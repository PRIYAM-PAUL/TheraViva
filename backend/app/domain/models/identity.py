"""Identity: users, one-time-password challenges and refresh tokens.

Four roles exist:

- ``patient``    — a customer of the practice (phone-OTP login).
- ``reception``  — front-desk staff: bookings, intake, invoices, payments.
- ``therapist``  — a clinician: own schedule, clinical notes, patient documents.
- ``admin``      — the practice owner: everything, including users and catalog.

Staff roles share the password login flow and are grouped in ``STAFF_ROLES``.
Authorization is enforced by ``app.api.deps.require_role``.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.models.base import Base, TimestampMixin, UTCDateTime

ROLE_PATIENT = "patient"
ROLE_RECEPTION = "reception"
ROLE_THERAPIST = "therapist"
ROLE_ADMIN = "admin"

#: Roles that authenticate with email + password and can reach the staff area.
STAFF_ROLES = (ROLE_RECEPTION, ROLE_THERAPIST, ROLE_ADMIN)

#: Every role the platform recognises.
ALL_ROLES = (ROLE_PATIENT, *STAFF_ROLES)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    role: Mapped[str] = mapped_column(String(16), default=ROLE_PATIENT, index=True)
    phone: Mapped[str | None] = mapped_column(String(24), unique=True, nullable=True, index=True)
    email: Mapped[str | None] = mapped_column(String(254), unique=True, nullable=True, index=True)
    name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class OtpChallenge(Base):
    __tablename__ = "otp_challenges"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    phone: Mapped[str] = mapped_column(String(24), index=True)
    code_hash: Mapped[str] = mapped_column(String(255))
    purpose: Mapped[str] = mapped_column(String(32), default="login")
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[datetime] = mapped_column(UTCDateTime)
    consumed_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime)


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(UTCDateTime)
    revoked_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime)
