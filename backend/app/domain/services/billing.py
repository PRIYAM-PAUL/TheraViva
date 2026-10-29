"""Billing: invoices, payments and refunds.

Payments are recorded through the configured ``PaymentProvider``. With the
default manual provider, a payment is captured because staff confirmed receipt
offline; a gateway provider would instead return a ``created`` intent to be
settled by a webhook.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.api.schemas.billing import PaymentCreate, RefundCreate
from app.domain.models import Invoice, Payment, Refund, User, utcnow
from app.domain.services import audit
from app.errors import NotFoundError, ValidationError
from app.providers.registry import get_payment_provider
from app.utils.gst import breakdown
from app.utils.pagination import paginate


async def next_invoice_number(session: AsyncSession) -> str:
    year = datetime.now(UTC).year
    count = int(
        await session.scalar(
            select(func.count()).select_from(Invoice).where(Invoice.number.like(f"TV-{year}-%"))
        )
        or 0
    )
    return f"TV-{year}-{count + 1:04d}"


async def create_invoice(
    session: AsyncSession,
    *,
    description: str,
    total_inr: int,
    appointment_id: str | None = None,
    patient_user_id: str | None = None,
    status: str = "issued",
) -> Invoice:
    if total_inr <= 0:
        raise ValidationError("Invoice total must be greater than zero.")
    tax = breakdown(total_inr)
    invoice = Invoice(
        id=str(uuid.uuid4()),
        number=await next_invoice_number(session),
        appointment_id=appointment_id,
        patient_user_id=patient_user_id,
        description=description,
        subtotal_inr=tax.subtotal_inr,
        tax_inr=tax.tax_inr,
        total_inr=tax.total_inr,
        currency="INR",
        status=status,
        issued_at=utcnow(),
    )
    session.add(invoice)
    return invoice


async def get_invoice(session: AsyncSession, invoice_id: str) -> Invoice:
    invoice = await session.get(Invoice, invoice_id)
    if invoice is None:
        raise NotFoundError("Invoice not found.")
    return invoice


async def record_payment(
    session: AsyncSession, payload: PaymentCreate, *, actor: User | None, request: Request
) -> Payment:
    invoice = await get_invoice(session, payload.invoice_id)
    if invoice.status == "void":
        raise ValidationError("Cannot pay a void invoice.")
    if payload.amount_inr > invoice.total_inr:
        raise ValidationError("Payment exceeds the invoice total.")

    provider = get_payment_provider()
    intent = await provider.create_payment(
        invoice_id=invoice.id,
        amount_inr=payload.amount_inr,
        method=payload.method,
        note=payload.note,
    )
    payment = Payment(
        id=str(uuid.uuid4()),
        invoice_id=invoice.id,
        provider=payload.provider or provider.name,
        provider_order_id=intent.id,
        provider_payment_id=intent.provider_payment_id,
        amount_inr=payload.amount_inr,
        method=payload.method,
        status=intent.status,
        raw=intent.raw,
        created_at=utcnow(),
    )
    session.add(payment)

    if intent.status == "captured":
        paid = int(
            await session.scalar(
                select(func.coalesce(func.sum(Payment.amount_inr), 0)).where(
                    Payment.invoice_id == invoice.id,
                    Payment.status == "captured",
                    Payment.id != payment.id,
                )
            )
            or 0
        )
        if paid + payment.amount_inr >= invoice.total_inr:
            invoice.status = "paid"
            invoice.paid_at = utcnow()

    await audit.record(
        session,
        action="payment.recorded",
        entity_type="payment",
        entity_id=payment.id,
        actor=actor,
        after={"invoice": invoice.number, "amount_inr": payment.amount_inr, "status": payment.status},
        request=request,
    )
    return payment


async def start_checkout(
    session: AsyncSession,
    *,
    invoice: Invoice,
    amount_inr: int,
    method: str,
    actor: User | None,
    request: Request,
) -> tuple[Payment, dict]:
    """Create a gateway order and a pending ``created`` payment.

    The payment is only marked captured after a verified callback/webhook, so an
    abandoned checkout leaves an honest ``created`` row rather than a fake success.
    """
    provider = get_payment_provider()
    intent = await provider.create_payment(
        invoice_id=invoice.id, amount_inr=amount_inr, method=method, note=None
    )
    payment = Payment(
        id=str(uuid.uuid4()),
        invoice_id=invoice.id,
        provider=provider.name,
        provider_order_id=intent.id,
        provider_payment_id=intent.provider_payment_id,
        amount_inr=amount_inr,
        method=method,
        status=intent.status,
        raw=intent.raw,
        created_at=utcnow(),
    )
    session.add(payment)
    await audit.record(
        session,
        action="payment.checkout_started",
        entity_type="payment",
        entity_id=payment.id,
        actor=actor,
        after={"invoice": invoice.number, "amount_inr": amount_inr, "provider": provider.name},
        request=request,
    )
    return payment, intent.raw


async def confirm_checkout(
    session: AsyncSession,
    *,
    payment: Payment,
    provider_payment_id: str,
    actor: User | None,
    request: Request,
) -> Payment:
    """Mark a checkout payment captured after signature verification."""
    if payment.status == "captured":
        return payment
    payment.provider_payment_id = provider_payment_id
    payment.status = "captured"
    invoice = await get_invoice(session, payment.invoice_id)
    paid = int(
        await session.scalar(
            select(func.coalesce(func.sum(Payment.amount_inr), 0)).where(
                Payment.invoice_id == invoice.id, Payment.status == "captured"
            )
        )
        or 0
    )
    if paid >= invoice.total_inr:
        invoice.status = "paid"
        invoice.paid_at = utcnow()
    await audit.record(
        session,
        action="payment.captured",
        entity_type="payment",
        entity_id=payment.id,
        actor=actor,
        after={"invoice": invoice.number, "amount_inr": payment.amount_inr},
        request=request,
    )
    return payment


async def refund(
    session: AsyncSession, payload: RefundCreate, *, actor: User | None, request: Request
) -> Refund:
    payment = await session.get(Payment, payload.payment_id)
    if payment is None:
        raise NotFoundError("Payment not found.")
    if payment.status != "captured":
        raise ValidationError("Only captured payments can be refunded.")
    already = int(
        await session.scalar(
            select(func.coalesce(func.sum(Refund.amount_inr), 0)).where(
                Refund.payment_id == payment.id, Refund.status != "failed"
            )
        )
        or 0
    )
    if already + payload.amount_inr > payment.amount_inr:
        raise ValidationError("Refund exceeds the captured amount.")

    entry = Refund(
        id=str(uuid.uuid4()),
        payment_id=payment.id,
        amount_inr=payload.amount_inr,
        reason=payload.reason,
        status="processed",
        provider_refund_id=f"refund_{uuid.uuid4().hex[:12]}",
        created_at=utcnow(),
    )
    session.add(entry)
    payment.status = "refunded" if already + payload.amount_inr >= payment.amount_inr else payment.status

    await audit.record(
        session,
        action="payment.refunded",
        entity_type="refund",
        entity_id=entry.id,
        actor=actor,
        after={"payment": payment.id, "amount_inr": entry.amount_inr},
        request=request,
    )
    return entry


async def list_invoices(
    session: AsyncSession, *, patient_user_id: str | None = None, limit: int = 50, offset: int = 0
) -> tuple[list[Invoice], int]:
    stmt = select(Invoice)
    if patient_user_id:
        stmt = stmt.where(Invoice.patient_user_id == patient_user_id)
    stmt = stmt.order_by(Invoice.created_at.desc())
    return await paginate(session, stmt, limit=limit, offset=offset)


async def list_payments(
    session: AsyncSession, *, invoice_id: str | None = None, limit: int = 50, offset: int = 0
) -> tuple[list[Payment], int]:
    stmt = select(Payment)
    if invoice_id:
        stmt = stmt.where(Payment.invoice_id == invoice_id)
    stmt = stmt.order_by(Payment.created_at.desc())
    return await paginate(session, stmt, limit=limit, offset=offset)


async def payments_for_user(session: AsyncSession, user_id: str) -> list[Payment]:
    rows = await session.scalars(
        select(Payment)
        .join(Invoice, Payment.invoice_id == Invoice.id)
        .where(Invoice.patient_user_id == user_id)
        .order_by(Payment.created_at.desc())
    )
    return list(rows.all())


async def outstanding_for_user(session: AsyncSession, user_id: str) -> int:
    issued = await session.scalars(
        select(Invoice).where(Invoice.patient_user_id == user_id, Invoice.status == "issued")
    )
    return sum(invoice.total_inr for invoice in issued.all())
