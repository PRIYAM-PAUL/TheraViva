"""Pydantic request/response schemas."""

from app.api.schemas.auth import (
    OtpRequestBody,
    OtpRequestResult,
    OtpVerifyBody,
    RefreshBody,
    StaffLoginBody,
    TokenPair,
    UserOut,
)
from app.api.schemas.billing import (
    InvoiceCreate,
    InvoiceOut,
    PaymentCreate,
    PaymentOut,
    RefundCreate,
    RefundOut,
)
from app.api.schemas.catalog import CatalogItemOut
from app.api.schemas.common import PageOut, ProblemOut
from app.api.schemas.dashboard import (
    AdminDashboardOut,
    KpiOut,
    PatientDashboardOut,
    SeoSummaryOut,
    TimeseriesPoint,
)
from app.api.schemas.engagement import EngagementEventIn, SeoSnapshotIn
from app.api.schemas.intake import (
    AppointmentRequestIn,
    EnquiryIn,
    IntakeOut,
    IntakeStatusUpdate,
    ReferralIn,
)
from app.api.schemas.scheduling import (
    AppointmentCreate,
    AppointmentOut,
    AppointmentStatusUpdate,
    AvailabilitySlot,
)

__all__ = [
    "AdminDashboardOut",
    "AppointmentCreate",
    "AppointmentOut",
    "AppointmentRequestIn",
    "AppointmentStatusUpdate",
    "AvailabilitySlot",
    "CatalogItemOut",
    "EngagementEventIn",
    "EnquiryIn",
    "IntakeOut",
    "IntakeStatusUpdate",
    "InvoiceCreate",
    "InvoiceOut",
    "KpiOut",
    "OtpRequestBody",
    "OtpRequestResult",
    "OtpVerifyBody",
    "PageOut",
    "PatientDashboardOut",
    "PaymentCreate",
    "PaymentOut",
    "ProblemOut",
    "ReferralIn",
    "RefundCreate",
    "RefundOut",
    "RefreshBody",
    "SeoSnapshotIn",
    "SeoSummaryOut",
    "StaffLoginBody",
    "TimeseriesPoint",
    "TokenPair",
    "UserOut",
]
