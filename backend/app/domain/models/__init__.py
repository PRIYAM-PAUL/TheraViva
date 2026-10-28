"""Model registry.

Importing this module registers every table on ``Base.metadata`` so that
``create_all`` and Alembic autogenerate see the full schema.
"""

from app.domain.models.base import Base, TimestampMixin, utcnow
from app.domain.models.billing import (
    INVOICE_STATUSES,
    PAYMENT_STATUSES,
    Invoice,
    Payment,
    Refund,
)  # re-exported for callers
from app.domain.models.catalog import CATALOG_KINDS, CatalogItem
from app.domain.models.clinical import ClinicalNote, Document
from app.domain.models.engagement import ENGAGEMENT_EVENT_TYPES, EngagementEvent, SeoSnapshot
from app.domain.models.identity import ROLE_ADMIN, ROLE_PATIENT, OtpChallenge, RefreshToken, User
from app.domain.models.intake import (
    INTAKE_STATUSES,
    AppointmentRequest,
    Enquiry,
    Referral,
)
from app.domain.models.ops import AuditLog, IdempotencyKey, NotificationLog, Reminder
from app.domain.models.scheduling import (
    APPOINTMENT_STATUSES,
    ActionToken,
    Appointment,
    AppointmentEvent,
    AvailabilityException,
    AvailabilityRule,
)

__all__ = [
    "APPOINTMENT_STATUSES",
    "CATALOG_KINDS",
    "ENGAGEMENT_EVENT_TYPES",
    "INTAKE_STATUSES",
    "INVOICE_STATUSES",
    "PAYMENT_STATUSES",
    "ROLE_ADMIN",
    "ROLE_PATIENT",
    "ActionToken",
    "Appointment",
    "AppointmentEvent",
    "AppointmentRequest",
    "AuditLog",
    "AvailabilityException",
    "AvailabilityRule",
    "Base",
    "CatalogItem",
    "ClinicalNote",
    "Document",
    "EngagementEvent",
    "Enquiry",
    "IdempotencyKey",
    "Invoice",
    "NotificationLog",
    "OtpChallenge",
    "Payment",
    "Referral",
    "RefreshToken",
    "Refund",
    "Reminder",
    "SeoSnapshot",
    "TimestampMixin",
    "User",
    "utcnow",
]
