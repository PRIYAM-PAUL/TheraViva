"""Billing routes: invoices, payments and refunds.

Patients see only their own invoices and payments; admins see everything and
perform the write operations.
"""

from __future__ import annotations

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import current_user, db_session, optional_user, pagination, read_json, require_admin
from app.api.responses import json_response
from app.api.schemas.billing import (
    InvoiceCreate,
    InvoiceOut,
    PaymentCreate,
    PaymentOut,
    RefundCreate,
    RefundOut,
)
from app.api.schemas.common import PageOut
from app.domain.models import Invoice, Payment, Refund
from app.domain.services import billing as billing_service
from app.errors import NotFoundError, UnauthorizedError
from app.utils.pagination import Page


def _invoice_out(invoice: Invoice) -> InvoiceOut:
    return InvoiceOut(
        id=invoice.id,
        number=invoice.number,
        appointment_id=invoice.appointment_id,
        patient_user_id=invoice.patient_user_id,
        description=invoice.description,
        subtotal_inr=invoice.subtotal_inr,
        tax_inr=invoice.tax_inr,
        total_inr=invoice.total_inr,
        currency=invoice.currency,
        status=invoice.status,
        issued_at=invoice.issued_at,
        paid_at=invoice.paid_at,
        created_at=invoice.created_at,
    )


def _payment_out(payment: Payment) -> PaymentOut:
    return PaymentOut(
        id=payment.id,
        invoice_id=payment.invoice_id,
        provider=payment.provider,
        amount_inr=payment.amount_inr,
        method=payment.method,
        status=payment.status,
        provider_payment_id=payment.provider_payment_id,
        created_at=payment.created_at,
    )


def _refund_out(refund: Refund) -> RefundOut:
    return RefundOut(
        id=refund.id,
        payment_id=refund.payment_id,
        amount_inr=refund.amount_inr,
        reason=refund.reason,
        status=refund.status,
        created_at=refund.created_at,
    )


async def list_invoices(request: Request) -> Response:
    limit, offset = pagination(request)
    async with db_session(request) as session:
        user = await optional_user(request, session)
        if user is None:
            raise UnauthorizedError("Sign in to view invoices.")
        is_admin = user.role == "admin"
        invoices, total = await billing_service.list_invoices(
            session, patient_user_id=None if is_admin else user.id, limit=limit, offset=offset
        )
        page = Page(items=[_invoice_out(i) for i in invoices], total=total, limit=limit, offset=offset)
    return json_response(
        PageOut[InvoiceOut](
            items=page.items, total=page.total, limit=page.limit, offset=page.offset, has_more=page.has_more
        )
    )


async def get_invoice(request: Request) -> Response:
    invoice_id = request.path_params["invoice_id"]
    async with db_session(request) as session:
        user = await optional_user(request, session)
        invoice = await billing_service.get_invoice(session, invoice_id)
        if invoice.patient_user_id and (
            user is None or (user.role != "admin" and user.id != invoice.patient_user_id)
        ):
            raise NotFoundError("Invoice not found.")
        return json_response(_invoice_out(invoice))


async def create_invoice(request: Request) -> Response:
    body = await read_json(request, InvoiceCreate)
    async with db_session(request) as session:
        await require_admin(request, session)
        invoice = await billing_service.create_invoice(
            session,
            description=body.description,
            total_inr=body.total_inr,
            appointment_id=body.appointment_id,
            patient_user_id=body.patient_user_id,
        )
        await session.commit()
        await session.refresh(invoice)
        return json_response(_invoice_out(invoice), status_code=201)


async def list_payments(request: Request) -> Response:
    limit, offset = pagination(request)
    invoice_id = request.query_params.get("invoiceId")
    async with db_session(request) as session:
        user = await current_user(request, session)
        if user.role == "admin":
            payments, total = await billing_service.list_payments(
                session, invoice_id=invoice_id, limit=limit, offset=offset
            )
        else:
            all_payments = await billing_service.payments_for_user(session, user.id)
            payments = all_payments[offset : offset + limit]
            total = len(all_payments)
        page = Page(items=[_payment_out(p) for p in payments], total=total, limit=limit, offset=offset)
    return json_response(
        PageOut[PaymentOut](
            items=page.items, total=page.total, limit=page.limit, offset=page.offset, has_more=page.has_more
        )
    )


async def record_payment(request: Request) -> Response:
    body = await read_json(request, PaymentCreate)
    async with db_session(request) as session:
        admin = await require_admin(request, session)
        payment = await billing_service.record_payment(session, body, actor=admin, request=request)
        await session.commit()
        await session.refresh(payment)
        return json_response(_payment_out(payment), status_code=201)


async def create_refund(request: Request) -> Response:
    body = await read_json(request, RefundCreate)
    async with db_session(request) as session:
        admin = await require_admin(request, session)
        refund = await billing_service.refund(session, body, actor=admin, request=request)
        await session.commit()
        await session.refresh(refund)
        return json_response(_refund_out(refund), status_code=201)
