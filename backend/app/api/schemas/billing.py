"""Billing schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.api.schemas.base import APIModel


class InvoiceCreate(APIModel):
    description: str = Field(min_length=1, max_length=255)
    total_inr: int = Field(gt=0)
    appointment_id: str | None = None
    patient_user_id: str | None = None


class InvoiceOut(APIModel):
    id: str
    number: str
    appointment_id: str | None = None
    patient_user_id: str | None = None
    description: str
    subtotal_inr: int
    tax_inr: int
    total_inr: int
    currency: str
    status: str
    issued_at: datetime | None = None
    paid_at: datetime | None = None
    created_at: datetime


class PaymentCreate(APIModel):
    invoice_id: str
    amount_inr: int = Field(gt=0)
    method: str = "upi"
    provider: str | None = None
    note: str | None = Field(default=None, max_length=255)


class PaymentOut(APIModel):
    id: str
    invoice_id: str
    provider: str
    amount_inr: int
    method: str | None = None
    status: str
    provider_payment_id: str | None = None
    created_at: datetime


class RefundCreate(APIModel):
    payment_id: str
    amount_inr: int = Field(gt=0)
    reason: str | None = Field(default=None, max_length=255)


class RefundOut(APIModel):
    id: str
    payment_id: str
    amount_inr: int
    reason: str | None = None
    status: str
    created_at: datetime
