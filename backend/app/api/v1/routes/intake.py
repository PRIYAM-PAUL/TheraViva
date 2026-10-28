"""Public intake routes (appointment requests, enquiries, referrals)."""

from __future__ import annotations

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import db_session, read_json
from app.api.responses import json_response
from app.api.schemas.intake import (
    AppointmentRequestIn,
    EnquiryIn,
    IntakeOut,
    ReferralIn,
)
from app.domain.services import intake as intake_service
from app.metrics import INTAKE_SUBMITTED


async def create_appointment_request(request: Request) -> Response:
    body = await read_json(request, AppointmentRequestIn)
    async with db_session(request) as session:
        record = await intake_service.create_appointment_request(session, body, request)
        await session.commit()
        INTAKE_SUBMITTED.labels("appointment-request").inc()
        return json_response(
            IntakeOut(id=record.id, reference=record.reference, status=record.status, kind="appointment-request"),
            status_code=201,
        )


async def create_enquiry(request: Request) -> Response:
    body = await read_json(request, EnquiryIn)
    async with db_session(request) as session:
        record = await intake_service.create_enquiry(session, body, request)
        await session.commit()
        INTAKE_SUBMITTED.labels("enquiry").inc()
        return json_response(
            IntakeOut(id=record.id, reference=record.reference, status=record.status, kind="enquiry"),
            status_code=201,
        )


async def create_referral(request: Request) -> Response:
    body = await read_json(request, ReferralIn)
    async with db_session(request) as session:
        record = await intake_service.create_referral(session, body, request)
        await session.commit()
        INTAKE_SUBMITTED.labels("referral").inc()
        return json_response(
            IntakeOut(id=record.id, reference=record.reference, status=record.status, kind="referral"),
            status_code=201,
        )
