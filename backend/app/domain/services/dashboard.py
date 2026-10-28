"""Dashboard aggregation for the patient and admin views.

Both endpoints return a complete, self-describing payload so the frontend can
render a full dashboard from a single request. ``has_records`` lets the UI show
an honest empty state when a patient (or a fresh install) has no history yet.
"""

from __future__ import annotations

from datetime import UTC, date, datetime, time, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import (
    Appointment,
    AppointmentRequest,
    AuditLog,
    EngagementEvent,
    Enquiry,
    Invoice,
    Payment,
    Referral,
    User,
    utcnow,
)
from app.domain.services import billing, engagement

UPCOMING_STATUSES = ("held", "requested", "confirmed")


def _serialize_appointment(appointment: Appointment) -> dict:
    return {
        "id": appointment.id,
        "reference": appointment.reference,
        "patient_user_id": appointment.patient_user_id,
        "professional_id": appointment.professional_id,
        "service_slug": appointment.service_slug,
        "mode": appointment.mode,
        "starts_at": appointment.starts_at,
        "ends_at": appointment.ends_at,
        "status": appointment.status,
        "location": appointment.location,
        "join_url": appointment.join_url,
        "notes": appointment.notes,
        "hold_expires_at": appointment.hold_expires_at,
        "created_at": appointment.created_at,
        "updated_at": appointment.updated_at,
    }


def _serialize_invoice(invoice: Invoice) -> dict:
    return {
        "id": invoice.id,
        "number": invoice.number,
        "appointment_id": invoice.appointment_id,
        "patient_user_id": invoice.patient_user_id,
        "description": invoice.description,
        "subtotal_inr": invoice.subtotal_inr,
        "tax_inr": invoice.tax_inr,
        "total_inr": invoice.total_inr,
        "currency": invoice.currency,
        "status": invoice.status,
        "issued_at": invoice.issued_at,
        "paid_at": invoice.paid_at,
        "created_at": invoice.created_at,
    }


def _serialize_payment(payment: Payment) -> dict:
    return {
        "id": payment.id,
        "invoice_id": payment.invoice_id,
        "provider": payment.provider,
        "amount_inr": payment.amount_inr,
        "method": payment.method,
        "status": payment.status,
        "provider_payment_id": payment.provider_payment_id,
        "created_at": payment.created_at,
    }


async def patient_dashboard(session: AsyncSession, user: User) -> dict:
    now = utcnow()
    upcoming = (
        await session.scalars(
            select(Appointment)
            .where(
                Appointment.patient_user_id == user.id,
                Appointment.starts_at >= now,
                Appointment.status.in_(UPCOMING_STATUSES + ("completed",)),
            )
            .order_by(Appointment.starts_at)
        )
    ).all()
    past = (
        await session.scalars(
            select(Appointment)
            .where(
                Appointment.patient_user_id == user.id,
                Appointment.starts_at < now,
            )
            .order_by(Appointment.starts_at.desc())
            .limit(20)
        )
    ).all()
    invoices, _ = await billing.list_invoices(session, patient_user_id=user.id, limit=50)
    payments = await billing.payments_for_user(session, user.id)
    paid = sum(p.amount_inr for p in payments if p.status == "captured")
    outstanding = await billing.outstanding_for_user(session, user.id)

    return {
        "user_id": user.id,
        "upcoming_appointments": [_serialize_appointment(a) for a in upcoming],
        "past_appointments": [_serialize_appointment(a) for a in past],
        "invoices": [_serialize_invoice(i) for i in invoices],
        "payments": [_serialize_payment(p) for p in payments],
        "outstanding_inr": outstanding,
        "paid_inr": paid,
        "has_records": bool(upcoming or past or invoices or payments),
    }


async def admin_dashboard(session: AsyncSession, start: date, end: date) -> dict:
    start_dt = datetime.combine(start, time.min, tzinfo=UTC)
    end_dt = datetime.combine(end, time.max, tzinfo=UTC)

    # Appointments by status.
    rows = await session.execute(
        select(Appointment.status, func.count()).group_by(Appointment.status)
    )
    appointments_by_status = {status: int(count) for status, count in rows.all()}

    # Intake by kind.
    intake_by_kind = {
        "appointment-requests": int(
            await session.scalar(select(func.count()).select_from(AppointmentRequest)) or 0
        ),
        "enquiries": int(await session.scalar(select(func.count()).select_from(Enquiry)) or 0),
        "referrals": int(await session.scalar(select(func.count()).select_from(Referral)) or 0),
    }

    # Revenue collected in range, by day.
    revenue_rows = await session.execute(
        select(func.date(Payment.created_at).label("day"), func.sum(Payment.amount_inr))
        .where(
            Payment.status == "captured",
            Payment.created_at >= start_dt,
            Payment.created_at <= end_dt,
        )
        .group_by(func.date(Payment.created_at))
        .order_by(func.date(Payment.created_at))
    )
    revenue_by_day = [{"day": row.day, "value": float(row[1])} for row in revenue_rows.all()]
    revenue_total = sum(point["value"] for point in revenue_by_day)

    outstanding_total = int(
        await session.scalar(
            select(func.coalesce(func.sum(Invoice.total_inr), 0)).where(Invoice.status == "issued")
        )
        or 0
    )

    engagement_rows = await engagement.engagement_by_day(session, start_dt, end_dt)
    event_counts = await engagement.counts_by_type(session, start_dt, end_dt)
    pages = await engagement.top_pages(session, start_dt, end_dt)
    seo = await engagement.seo_summary(session, start, end)

    total_appointments = sum(appointments_by_status.values())
    leads = event_counts.get("booking_submitted", 0) + event_counts.get("contact_submitted", 0)

    def _kpi(key: str, label: str, value: float, unit: str | None = None) -> dict:
        return {"key": key, "label": label, "value": value, "unit": unit, "delta_pct": None}

    kpis = [
        _kpi("appointments_total", "Appointments", float(total_appointments)),
        _kpi("appointments_confirmed", "Confirmed", float(appointments_by_status.get("confirmed", 0))),
        _kpi("revenue_collected", "Revenue collected", revenue_total, "INR"),
        _kpi("outstanding", "Outstanding", float(outstanding_total), "INR"),
        _kpi("page_views", "Page views", float(event_counts.get("page_view", 0))),
        _kpi("leads", "Leads", float(leads)),
        _kpi("seo_clicks", "SEO clicks", float(seo["clicks"])),
    ]

    recent_intake: list[dict] = []
    intake_models: list[tuple[type[Any], str]] = [
        (AppointmentRequest, "appointment-request"),
        (Enquiry, "enquiry"),
        (Referral, "referral"),
    ]
    for model, kind in intake_models:
        latest = (
            await session.scalars(select(model).order_by(model.created_at.desc()).limit(5))
        ).all()
        for item in latest:
            recent_intake.append(
                {
                    "kind": kind,
                    "id": item.id,
                    "reference": item.reference,
                    "status": item.status,
                    "created_at": item.created_at,
                }
            )
    recent_intake.sort(key=lambda row: row["created_at"], reverse=True)
    recent_intake = recent_intake[:10]

    audit_rows = (
        await session.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10))
    ).all()
    recent_audit = [
        {
            "id": row.id,
            "action": row.action,
            "entity_type": row.entity_type,
            "entity_id": row.entity_id,
            "actor_role": row.actor_role,
            "created_at": row.created_at,
        }
        for row in audit_rows
    ]

    engagement_total = int(
        await session.scalar(
            select(func.count())
            .select_from(EngagementEvent)
            .where(EngagementEvent.created_at >= start_dt, EngagementEvent.created_at <= end_dt)
        )
        or 0
    )

    return {
        "generated_at": utcnow(),
        "range_from": start,
        "range_to": end,
        "kpis": kpis,
        "appointments_by_status": appointments_by_status,
        "intake_by_kind": intake_by_kind,
        "revenue_by_day": revenue_by_day,
        "engagement_by_day": engagement_rows,
        "top_pages": pages,
        "seo": seo,
        "recent_intake": recent_intake,
        "recent_audit": recent_audit,
        "has_records": bool(
            total_appointments
            or sum(intake_by_kind.values())
            or revenue_total
            or engagement_total
        ),
    }


def default_range(days: int = 30) -> tuple[date, date]:
    today = datetime.now(UTC).date()
    return today - timedelta(days=days), today
