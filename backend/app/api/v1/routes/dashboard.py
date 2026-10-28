"""Dashboard routes for the patient and admin views."""

from __future__ import annotations

from datetime import date, timedelta

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import current_user, db_session, require_admin
from app.api.responses import json_response
from app.api.schemas.dashboard import AdminDashboardOut, PatientDashboardOut
from app.domain.services import dashboard as dashboard_service
from app.errors import ValidationError


async def patient_dashboard(request: Request) -> Response:
    async with db_session(request) as session:
        user = await current_user(request, session)
        data = await dashboard_service.patient_dashboard(session, user)
    return json_response(PatientDashboardOut(**data))


async def admin_dashboard(request: Request) -> Response:
    today = date.today()
    try:
        range_from = date.fromisoformat(request.query_params.get("from", (today - timedelta(days=30)).isoformat()))
        range_to = date.fromisoformat(request.query_params.get("to", today.isoformat()))
    except ValueError as exc:
        raise ValidationError("Dates must be ISO 'YYYY-MM-DD'.") from exc
    if range_to < range_from:
        raise ValidationError("'to' must be on or after 'from'.")
    if (range_to - range_from).days > 366:
        raise ValidationError("Range is too large (maximum 366 days).")

    async with db_session(request) as session:
        await require_admin(request, session)
        data = await dashboard_service.admin_dashboard(session, range_from, range_to)
    return json_response(AdminDashboardOut(**data))
