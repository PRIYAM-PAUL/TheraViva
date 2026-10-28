"""Scheduling: availability rules, exceptions, appointments and action tokens."""

from __future__ import annotations

from datetime import date, datetime, time

from sqlalchemy import Date, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.domain.models.base import Base, TimestampMixin, UTCDateTime

# Appointment lifecycle. ``held`` is a short-lived slot reservation; ``requested``
# is a submitted-but-unconfirmed booking; ``confirmed`` is authoritative.
APPOINTMENT_STATUSES = (
    "held",
    "requested",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
)


class AvailabilityRule(Base, TimestampMixin):
    """A recurring weekly availability window for a professional + mode."""

    __tablename__ = "availability_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    professional_id: Mapped[str] = mapped_column(String(64), index=True)
    mode: Mapped[str] = mapped_column(String(24))
    weekday: Mapped[int] = mapped_column(Integer)  # 0 = Monday … 6 = Sunday
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    slot_minutes: Mapped[int] = mapped_column(Integer, default=45)
    effective_from: Mapped[date | None] = mapped_column(Date, nullable=True)
    effective_to: Mapped[date | None] = mapped_column(Date, nullable=True)


class AvailabilityException(Base, TimestampMixin):
    """A one-off block or extra window that overrides the weekly rules."""

    __tablename__ = "availability_exceptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    professional_id: Mapped[str] = mapped_column(String(64), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    kind: Mapped[str] = mapped_column(String(16))  # "blocked" | "extra"
    start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    reason: Mapped[str | None] = mapped_column(String(200), nullable=True)


class Appointment(Base, TimestampMixin):
    __tablename__ = "appointments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    patient_user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    professional_id: Mapped[str] = mapped_column(String(64), index=True)
    service_slug: Mapped[str] = mapped_column(String(96))
    mode: Mapped[str] = mapped_column(String(24))
    starts_at: Mapped[datetime] = mapped_column(UTCDateTime, index=True)
    ends_at: Mapped[datetime] = mapped_column(UTCDateTime)
    status: Mapped[str] = mapped_column(String(16), default="requested", index=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    join_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    hold_expires_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)
    reschedule_of: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)


class AppointmentEvent(Base):
    __tablename__ = "appointment_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    appointment_id: Mapped[str] = mapped_column(
        ForeignKey("appointments.id", ondelete="CASCADE"), index=True
    )
    from_status: Mapped[str | None] = mapped_column(String(16), nullable=True)
    to_status: Mapped[str] = mapped_column(String(16))
    actor: Mapped[str | None] = mapped_column(String(36), nullable=True)
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime)


class ActionToken(Base):
    """A hashed, single-use token backing a signed reschedule/cancel/join link."""

    __tablename__ = "action_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    appointment_id: Mapped[str] = mapped_column(
        ForeignKey("appointments.id", ondelete="CASCADE"), index=True
    )
    purpose: Mapped[str] = mapped_column(String(16))  # reschedule|cancel|join|pay
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(UTCDateTime)
    used_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
