"""Scheduling schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.api.schemas.base import APIModel


class AvailabilitySlot(APIModel):
    professional_id: str
    mode: str
    starts_at: datetime
    ends_at: datetime
    available: bool = True


class AppointmentCreate(APIModel):
    service_slug: str = Field(min_length=1)
    professional_id: str = ""
    mode: str
    #: A concrete chosen slot. The "no time chosen yet" flow is the intake
    #: endpoint (appointment-requests), not this one.
    starts_at: datetime
    notes: str = Field(default="", max_length=2000)
    #: When true, create a short-lived hold instead of a request.
    hold: bool = False


class AppointmentOut(APIModel):
    id: str
    reference: str
    patient_user_id: str | None = None
    professional_id: str
    service_slug: str
    mode: str
    starts_at: datetime
    ends_at: datetime
    status: str
    location: str | None = None
    join_url: str | None = None
    notes: str | None = None
    hold_expires_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class AppointmentStatusUpdate(APIModel):
    status: str
    note: str | None = Field(default=None, max_length=500)
