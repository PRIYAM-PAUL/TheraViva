"""Dashboard response schemas for the patient and admin views."""

from __future__ import annotations

from datetime import date, datetime

from app.api.schemas.base import APIModel
from app.api.schemas.billing import InvoiceOut, PaymentOut
from app.api.schemas.scheduling import AppointmentOut


class KpiOut(APIModel):
    key: str
    label: str
    value: float
    unit: str | None = None
    delta_pct: float | None = None


class TimeseriesPoint(APIModel):
    day: date
    value: float


class SeoSummaryOut(APIModel):
    impressions: int
    clicks: int
    ctr: float
    average_position: float
    top_pages: list[dict]


class PatientDashboardOut(APIModel):
    user_id: str
    upcoming_appointments: list[AppointmentOut]
    past_appointments: list[AppointmentOut]
    invoices: list[InvoiceOut]
    payments: list[PaymentOut]
    outstanding_inr: int
    paid_inr: int
    has_records: bool


class AdminDashboardOut(APIModel):
    generated_at: datetime
    range_from: date
    range_to: date
    kpis: list[KpiOut]
    appointments_by_status: dict[str, int]
    intake_by_kind: dict[str, int]
    revenue_by_day: list[TimeseriesPoint]
    engagement_by_day: list[TimeseriesPoint]
    top_pages: list[dict]
    seo: SeoSummaryOut
    recent_intake: list[dict]
    recent_audit: list[dict]
    has_records: bool
