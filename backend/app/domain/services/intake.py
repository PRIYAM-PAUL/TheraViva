"""Intake service: persisted appointment requests, enquiries and referrals."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.api.deps import client_ip, user_agent
from app.api.schemas.intake import AppointmentRequestIn, EnquiryIn, ReferralIn
from app.domain.models import AppointmentRequest, Enquiry, Referral
from app.domain.services import catalog as catalog_service
from app.domain.services import notifications
from app.errors import NotFoundError, ValidationError
from app.utils.hashing import hash_ip
from app.utils.security import new_reference


async def create_appointment_request(
    session: AsyncSession, payload: AppointmentRequestIn, request: Request
) -> AppointmentRequest:
    if not await catalog_service.exists(session, "service", payload.service_slug):
        raise ValidationError(
            "Please choose a valid service.",
            errors=[{"field": "serviceSlug", "message": "Unknown service."}],
        )
    if payload.professional_id and not await catalog_service.exists(
        session, "professional", payload.professional_id
    ):
        raise ValidationError(
            "Please choose a listed specialist, or leave it as no preference.",
            errors=[{"field": "professionalId", "message": "Unknown professional."}],
        )

    from datetime import date

    record = AppointmentRequest(
        id=str(uuid.uuid4()),
        reference=new_reference(),
        mode=payload.mode,
        service_slug=payload.service_slug,
        professional_id=payload.professional_id or None,
        preferred_date=date.fromisoformat(payload.preferred_date) if payload.preferred_date else None,
        preferred_time=payload.preferred_time or None,
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email or None,
        patient_name=payload.patient_name,
        notes=payload.notes or None,
        consent=payload.consent,
        status="received",
        source=payload.source,
        ip_hash=hash_ip(client_ip(request)),
        user_agent=user_agent(request),
    )
    session.add(record)

    body = (
        f"New appointment request ({record.reference})\n"
        f"Service: {payload.service_slug}\n"
        f"Mode: {payload.mode}\n"
        f"Preferred: {payload.preferred_date or 'any'} {payload.preferred_time or ''}\n"
        f"Patient: {payload.patient_name}"
    )
    await notifications.dispatch(
        session,
        channel="email",
        template="appointment_request.received",
        recipient=payload.email or None,
        subject=f"Appointment request {record.reference}",
        body=body,
    )
    return record


async def create_enquiry(session: AsyncSession, payload: EnquiryIn, request: Request) -> Enquiry:
    record = Enquiry(
        id=str(uuid.uuid4()),
        reference=new_reference("TVE"),
        name=payload.name,
        email=payload.email or None,
        phone=payload.phone or None,
        subject=payload.subject,
        message=payload.message,
        consent=payload.consent,
        status="received",
        ip_hash=hash_ip(client_ip(request)),
    )
    session.add(record)
    await notifications.dispatch(
        session,
        channel="email",
        template="enquiry.received",
        recipient=payload.email or None,
        subject="We received your enquiry",
        body=f"Thanks {payload.name}, we have your message and will reply shortly.",
    )
    return record


async def create_referral(session: AsyncSession, payload: ReferralIn, request: Request) -> Referral:
    record = Referral(
        id=str(uuid.uuid4()),
        reference=new_reference("TVR"),
        referrer_name=payload.referrer_name,
        referrer_role=payload.referrer_role,
        referrer_org=payload.referrer_org,
        referrer_contact=payload.referrer_contact,
        client_name=payload.client_name,
        client_age=payload.client_age,
        concerns=payload.concerns,
        history=payload.history,
        preferred_format=payload.preferred_format,
        consent=payload.consent,
        status="received",
        ip_hash=hash_ip(client_ip(request)),
    )
    session.add(record)
    return record


# --- Admin reads -----------------------------------------------------------
_INTAKE_MODELS = {
    "appointment-requests": AppointmentRequest,
    "enquiries": Enquiry,
    "referrals": Referral,
}


def intake_model(kind: str):
    model = _INTAKE_MODELS.get(kind)
    if model is None:
        raise NotFoundError(f"Unknown intake kind '{kind}'.")
    return model


async def list_intake(
    session: AsyncSession, kind: str, *, status: str | None, limit: int, offset: int
) -> tuple[list, int]:
    from app.utils.pagination import paginate

    model = intake_model(kind)
    stmt = select(model)
    if status:
        stmt = stmt.where(model.status == status)
    stmt = stmt.order_by(model.created_at.desc())
    return await paginate(session, stmt, limit=limit, offset=offset)


async def update_status(session: AsyncSession, kind: str, record_id: str, status: str):
    from app.domain.models import INTAKE_STATUSES

    if status not in INTAKE_STATUSES:
        raise ValidationError(f"Invalid status '{status}'.")
    model = intake_model(kind)
    record = await session.get(model, record_id)
    if record is None:
        raise NotFoundError("Record not found.")
    record.status = status
    return record


async def count_by_kind(session: AsyncSession) -> dict[str, int]:
    from sqlalchemy import func

    return {
        "appointment-requests": int(
            await session.scalar(select(func.count()).select_from(AppointmentRequest)) or 0
        ),
        "enquiries": int(await session.scalar(select(func.count()).select_from(Enquiry)) or 0),
        "referrals": int(await session.scalar(select(func.count()).select_from(Referral)) or 0),
    }
