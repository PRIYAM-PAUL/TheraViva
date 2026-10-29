"""Availability and appointment routes."""

from __future__ import annotations

from datetime import date, datetime, timedelta

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import (
    current_user,
    db_session,
    optional_user,
    pagination,
    read_json,
    require_staff,
)
from app.api.responses import json_response
from app.api.schemas.common import PageOut
from app.api.schemas.scheduling import (
    AppointmentCreate,
    AppointmentOut,
    AppointmentStatusUpdate,
    AvailabilitySlot,
)
from app.domain.models import STAFF_ROLES
from app.domain.services import scheduling as scheduling_service
from app.errors import NotFoundError, ValidationError
from app.metrics import APPOINTMENTS_CREATED
from app.utils.pagination import Page

TERMINAL_STATUSES = ("cancelled", "completed", "no_show")


def _appointment_out(appointment) -> AppointmentOut:
    return AppointmentOut(
        id=appointment.id,
        reference=appointment.reference,
        patient_user_id=appointment.patient_user_id,
        professional_id=appointment.professional_id,
        service_slug=appointment.service_slug,
        mode=appointment.mode,
        starts_at=appointment.starts_at,
        ends_at=appointment.ends_at,
        status=appointment.status,
        location=appointment.location,
        join_url=appointment.join_url,
        notes=appointment.notes,
        hold_expires_at=appointment.hold_expires_at,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at,
    )


async def list_availability(request: Request) -> Response:
    professional_id = request.query_params.get("professional") or request.query_params.get(
        "professionalId"
    )
    mode = request.query_params.get("mode")
    if not professional_id or not mode:
        raise ValidationError("Both 'professional' and 'mode' query parameters are required.")
    today = date.today()
    try:
        from_date = date.fromisoformat(request.query_params.get("from", today.isoformat()))
        to_date = date.fromisoformat(
            request.query_params.get("to", (today + timedelta(days=14)).isoformat())
        )
    except ValueError as exc:
        raise ValidationError("Dates must be ISO 'YYYY-MM-DD'.") from exc
    if to_date < from_date:
        raise ValidationError("'to' must be on or after 'from'.")
    if (to_date - from_date).days > 60:
        raise ValidationError("Range is too large (maximum 60 days).")

    async with db_session(request) as session:
        slots = await scheduling_service.generate_slots(
            session, professional_id=professional_id, mode=mode, from_date=from_date, to_date=to_date
        )
    return json_response([AvailabilitySlot(**slot) for slot in slots])


async def create_appointment(request: Request) -> Response:
    body = await read_json(request, AppointmentCreate)
    async with db_session(request) as session:
        user = await optional_user(request, session)
        appointment = await scheduling_service.create_appointment(
            session, body, user=user, request=request
        )
        await session.commit()
        await session.refresh(appointment)
        APPOINTMENTS_CREATED.labels(appointment.status).inc()
        return json_response(_appointment_out(appointment), status_code=201)


async def list_appointments(request: Request) -> Response:
    limit, offset = pagination(request)
    async with db_session(request) as session:
        user = await optional_user(request, session)
        is_admin = user is not None and user.role == "admin"
        status = request.query_params.get("status")
        professional_id = request.query_params.get("professional")
        from_raw = request.query_params.get("from")
        to_raw = request.query_params.get("to")
        from_dt = datetime.fromisoformat(from_raw) if from_raw else None
        to_dt = datetime.fromisoformat(to_raw) if to_raw else None

        items, total = await scheduling_service.list_appointments(
            session,
            patient_user_id=None if is_admin else (user.id if user else None),
            professional_id=professional_id,
            status=status,
            from_dt=from_dt,
            to_dt=to_dt,
            limit=limit,
            offset=offset,
        )
        page = Page(items=[_appointment_out(a) for a in items], total=total, limit=limit, offset=offset)
    return json_response(
        PageOut[AppointmentOut](
            items=page.items, total=page.total, limit=page.limit, offset=page.offset, has_more=page.has_more
        )
    )


async def get_appointment(request: Request) -> Response:
    reference = request.path_params["reference"]
    async with db_session(request) as session:
        user = await optional_user(request, session)
        appointment = await scheduling_service.get_by_reference(session, reference)
        if appointment.patient_user_id and (
            user is None or (user.role != "admin" and user.id != appointment.patient_user_id)
        ):
            raise NotFoundError("Appointment not found.")
        return json_response(_appointment_out(appointment))


async def update_appointment_status(request: Request) -> Response:
    reference = request.path_params["reference"]
    body = await read_json(request, AppointmentStatusUpdate)
    async with db_session(request) as session:
        admin = await require_staff(request, session)
        appointment = await scheduling_service.get_by_reference(session, reference)
        await scheduling_service.transition(
            session, appointment, body.status, actor=admin, note=body.note, request=request
        )
        await session.commit()
        await session.refresh(appointment)
        return json_response(_appointment_out(appointment))


async def cancel_appointment(request: Request) -> Response:
    """A patient cancels their own appointment; staff may cancel any."""
    reference = request.path_params["reference"]
    async with db_session(request) as session:
        user = await current_user(request, session)
        appointment = await scheduling_service.get_by_reference(session, reference)
        is_staff = user.role in STAFF_ROLES
        if not is_staff and appointment.patient_user_id != user.id:
            raise NotFoundError("Appointment not found.")
        if appointment.status in TERMINAL_STATUSES:
            raise ValidationError("This appointment can no longer be cancelled.")
        await scheduling_service.transition(
            session,
            appointment,
            "cancelled",
            actor=user,
            note="Cancelled by " + ("staff" if is_staff else "patient"),
            request=request,
        )
        await session.commit()
        await session.refresh(appointment)
        return json_response(_appointment_out(appointment))
