"""Intake: persisted appointment requests, enquiries and professional referrals."""

from __future__ import annotations

from datetime import date

from sqlalchemy import Boolean, Date, String
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.models.base import Base, TimestampMixin

INTAKE_STATUSES = ("received", "contacted", "scheduled", "closed", "cancelled")


class AppointmentRequest(Base, TimestampMixin):
    __tablename__ = "appointment_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    mode: Mapped[str] = mapped_column(String(24))
    service_slug: Mapped[str] = mapped_column(String(96))
    professional_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    preferred_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    preferred_time: Mapped[str | None] = mapped_column(String(24), nullable=True)
    full_name: Mapped[str] = mapped_column(String(80))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    patient_name: Mapped[str] = mapped_column(String(80))
    notes: Mapped[str | None] = mapped_column(String(600), nullable=True)
    consent: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(16), default="received", index=True)
    source: Mapped[str | None] = mapped_column(String(48), nullable=True)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(255), nullable=True)
    converted_appointment_id: Mapped[str | None] = mapped_column(String(36), nullable=True)


class Enquiry(Base, TimestampMixin):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str | None] = mapped_column(String(254), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    subject: Mapped[str | None] = mapped_column(String(160), nullable=True)
    message: Mapped[str] = mapped_column(String(2000))
    consent: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(16), default="received", index=True)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)


class Referral(Base, TimestampMixin):
    __tablename__ = "referrals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    reference: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    referrer_name: Mapped[str] = mapped_column(String(120))
    referrer_role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    referrer_org: Mapped[str | None] = mapped_column(String(160), nullable=True)
    referrer_contact: Mapped[str | None] = mapped_column(String(160), nullable=True)
    client_name: Mapped[str] = mapped_column(String(120))
    client_age: Mapped[str | None] = mapped_column(String(24), nullable=True)
    concerns: Mapped[str] = mapped_column(String(2000))
    history: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    preferred_format: Mapped[str | None] = mapped_column(String(48), nullable=True)
    consent: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(16), default="received", index=True)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
