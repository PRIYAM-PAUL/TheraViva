"""Scheduling: slot generation, appointment lifecycle and conflict checks."""

from __future__ import annotations

import uuid
from datetime import UTC, date, datetime, time, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.api.schemas.scheduling import AppointmentCreate
from app.domain.models import (
    APPOINTMENT_STATUSES,
    Appointment,
    AppointmentEvent,
    AvailabilityException,
    AvailabilityRule,
    User,
    utcnow,
)
from app.domain.services import audit
from app.domain.services import catalog as catalog_service
from app.errors import ConflictError, NotFoundError, ValidationError
from app.utils.security import new_reference

ACTIVE_STATUSES = ("held", "requested", "confirmed")
HOLD_MINUTES = 15


def _as_utc(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


async def _service_duration(session: AsyncSession, service_slug: str) -> int:
    item = await catalog_service.get_item(session, "service", service_slug)
    if item is None:
        raise ValidationError(
            "Unknown service.",
            errors=[{"field": "serviceSlug", "message": "Unknown service."}],
        )
    return int((item.data or {}).get("durationMinutes") or 45)


async def _existing_slots(
    session: AsyncSession, professional_id: str, start: datetime, end: datetime
) -> list[tuple[datetime, datetime]]:
    rows = await session.scalars(
        select(Appointment).where(
            Appointment.professional_id == professional_id,
            Appointment.status.in_(ACTIVE_STATUSES),
            Appointment.starts_at < end,
            Appointment.ends_at > start,
        )
    )
    return [(_as_utc(row.starts_at), _as_utc(row.ends_at)) for row in rows.all()]


async def generate_slots(
    session: AsyncSession,
    *,
    professional_id: str,
    mode: str,
    from_date: date,
    to_date: date,
) -> list[dict[str, Any]]:
    """Build bookable slots from weekly rules, minus exceptions and bookings."""
    rules = (
        await session.scalars(
            select(AvailabilityRule).where(
                AvailabilityRule.professional_id == professional_id,
                AvailabilityRule.mode == mode,
            )
        )
    ).all()
    if not rules:
        return []

    exceptions = (
        await session.scalars(
            select(AvailabilityException).where(
                AvailabilityException.professional_id == professional_id,
                AvailabilityException.day >= from_date,
                AvailabilityException.day <= to_date,
            )
        )
    ).all()
    blocked_days = {
        exc.day for exc in exceptions if exc.kind == "blocked" and exc.start_time is None
    }

    now = utcnow()
    slots: list[dict[str, Any]] = []
    day = from_date
    while day <= to_date:
        if day in blocked_days:
            day += timedelta(days=1)
            continue
        for rule in rules:
            if rule.weekday != day.weekday():
                continue
            if rule.effective_from and day < rule.effective_from:
                continue
            if rule.effective_to and day > rule.effective_to:
                continue
            start_dt = datetime.combine(day, rule.start_time, tzinfo=UTC)
            end_dt = datetime.combine(day, rule.end_time, tzinfo=UTC)
            booked = await _existing_slots(session, professional_id, start_dt, end_dt)
            cursor = start_dt
            while cursor + timedelta(minutes=rule.slot_minutes) <= end_dt:
                slot_end = cursor + timedelta(minutes=rule.slot_minutes)
                taken = any(
                    cursor < b_end and slot_end > b_start for b_start, b_end in booked
                )
                if not taken and cursor > now:
                    slots.append(
                        {
                            "professional_id": professional_id,
                            "mode": mode,
                            "starts_at": cursor,
                            "ends_at": slot_end,
                            "available": True,
                        }
                    )
                cursor = slot_end
        day += timedelta(days=1)
    return slots


async def create_appointment(
    session: AsyncSession,
    payload: AppointmentCreate,
    *,
    user: User | None,
    request: Request,
) -> Appointment:
    if payload.starts_at is None:
        raise ValidationError(
            "A start time is required.",
            errors=[{"field": "startsAt", "message": "Choose a time slot."}],
        )
    starts_at = _as_utc(payload.starts_at)
    if starts_at <= utcnow():
        raise ValidationError(
            "The chosen time is in the past.",
            errors=[{"field": "startsAt", "message": "Choose a future time."}],
        )
    duration = await _service_duration(session, payload.service_slug)
    ends_at = starts_at + timedelta(minutes=duration)

    professional_id = payload.professional_id
    if not professional_id:
        item = await catalog_service.get_item(session, "service", payload.service_slug)
        ids = (item.data or {}).get("professionalIds") or [] if item else []
        professional_id = ids[0] if ids else ""

    conflicts = await _existing_slots(session, professional_id, starts_at, ends_at)
    if conflicts:
        raise ConflictError("That time is no longer available. Please pick another slot.")

    status = "held" if payload.hold else "requested"
    appointment = Appointment(
        id=str(uuid.uuid4()),
        reference=new_reference(),
        patient_user_id=user.id if user else None,
        professional_id=professional_id,
        service_slug=payload.service_slug,
        mode=payload.mode,
        starts_at=starts_at,
        ends_at=ends_at,
        status=status,
        notes=payload.notes or None,
        hold_expires_at=(utcnow() + timedelta(minutes=HOLD_MINUTES)) if payload.hold else None,
        created_by=user.id if user else None,
    )
    session.add(appointment)
    session.add(
        AppointmentEvent(
            id=str(uuid.uuid4()),
            appointment_id=appointment.id,
            from_status=None,
            to_status=status,
            actor=user.id if user else None,
            created_at=utcnow(),
        )
    )
    await audit.record(
        session,
        action="appointment.created",
        entity_type="appointment",
        entity_id=appointment.id,
        actor=user,
        after={"status": status, "reference": appointment.reference},
        request=request,
    )
    return appointment


async def transition(
    session: AsyncSession,
    appointment: Appointment,
    to_status: str,
    *,
    actor: User | None,
    note: str | None = None,
    request: Request | None = None,
) -> Appointment:
    if to_status not in APPOINTMENT_STATUSES:
        raise ValidationError(f"Invalid appointment status '{to_status}'.")
    from_status = appointment.status
    appointment.status = to_status
    if to_status == "confirmed":
        appointment.hold_expires_at = None
    session.add(
        AppointmentEvent(
            id=str(uuid.uuid4()),
            appointment_id=appointment.id,
            from_status=from_status,
            to_status=to_status,
            actor=actor.id if actor else None,
            note=note,
            created_at=utcnow(),
        )
    )
    await audit.record(
        session,
        action="appointment.status_changed",
        entity_type="appointment",
        entity_id=appointment.id,
        actor=actor,
        before={"status": from_status},
        after={"status": to_status},
        request=request,
    )
    return appointment


async def get_by_reference(session: AsyncSession, reference: str) -> Appointment:
    appointment = await session.scalar(
        select(Appointment).where(Appointment.reference == reference)
    )
    if appointment is None:
        raise NotFoundError("Appointment not found.")
    return appointment


async def list_appointments(
    session: AsyncSession,
    *,
    patient_user_id: str | None = None,
    professional_id: str | None = None,
    status: str | None = None,
    from_dt: datetime | None = None,
    to_dt: datetime | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Appointment], int]:
    from app.utils.pagination import paginate

    stmt = select(Appointment)
    if patient_user_id:
        stmt = stmt.where(Appointment.patient_user_id == patient_user_id)
    if professional_id:
        stmt = stmt.where(Appointment.professional_id == professional_id)
    if status:
        stmt = stmt.where(Appointment.status == status)
    if from_dt:
        stmt = stmt.where(Appointment.starts_at >= from_dt)
    if to_dt:
        stmt = stmt.where(Appointment.starts_at <= to_dt)
    stmt = stmt.order_by(Appointment.starts_at.desc())
    return await paginate(session, stmt, limit=limit, offset=offset)


def combine(day: date, clock: time) -> datetime:
    return datetime.combine(day, clock, tzinfo=UTC)
