"""Billing routes: invoices, payments and refunds.

Patients see only their own invoices and payments; admins see everything and
perform the write operations.
"""

from __future__ import annotations

from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import (
    current_user,
    db_session,
    optional_user,
    pagination,
    read_json,
    require_admin,
    require_role,
)
from app.api.responses import json_response
from app.api.schemas.billing import (
    CheckoutStart,
    CheckoutStartOut,
    CheckoutVerify,
    InvoiceCreate,
    InvoiceOut,
    PaymentCreate,
    PaymentOut,
    RefundCreate,
    RefundOut,
)
from app.api.schemas.common import PageOut
from app.domain.models import ROLE_ADMIN, ROLE_RECEPTION, STAFF_ROLES, Invoice, Payment, Refund, User
from app.domain.services import billing as billing_service
from app.errors import NotFoundError, UnauthorizedError, ValidationError
from app.providers.registry import get_payment_provider
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
        is_staff = user.role in STAFF_ROLES
        invoices, total = await billing_service.list_invoices(
            session, patient_user_id=None if is_staff else user.id, limit=limit, offset=offset
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
        await require_role(request, session, ROLE_ADMIN, ROLE_RECEPTION)
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
        if user.role in STAFF_ROLES:
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
        admin = await require_role(request, session, ROLE_ADMIN, ROLE_RECEPTION)
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


async def _authorize_invoice(invoice: Invoice, user: User) -> None:
    is_staff = user.role in STAFF_ROLES
    if invoice.patient_user_id and not is_staff and invoice.patient_user_id != user.id:
        raise NotFoundError("Invoice not found.")


async def create_checkout(request: Request) -> Response:
    """Start an online (Razorpay) checkout for an invoice the caller may pay."""
    body = await read_json(request, CheckoutStart)
    provider = get_payment_provider()
    # Never fabricate a capture: only a gateway provider can open a real checkout.
    if getattr(provider, "verify_checkout_signature", None) is None:
        raise ValidationError("Online payments are not enabled on this server.")
    async with db_session(request) as session:
        user = await current_user(request, session)
        invoice = await billing_service.get_invoice(session, body.invoice_id)
        await _authorize_invoice(invoice, user)
        if invoice.status == "void":
            raise ValidationError("This invoice is void.")
        amount = body.amount_inr or invoice.total_inr
        if amount > invoice.total_inr:
            raise ValidationError("Amount exceeds the invoice total.")
        payment, raw = await billing_service.start_checkout(
            session, invoice=invoice, amount_inr=amount, method="card", actor=user, request=request
        )
        await session.commit()
        await session.refresh(payment)
        return json_response(
            CheckoutStartOut(
                payment_id=payment.id,
                order_id=str(raw.get("orderId", "")),
                key_id=str(raw.get("keyId", "")),
                amount=int(raw.get("amount", amount * 100)),
                currency=str(raw.get("currency", "INR")),
                amount_inr=amount,
            ),
            status_code=201,
        )


async def verify_checkout(request: Request) -> Response:
    """Verify the Checkout signature and capture the payment."""
    body = await read_json(request, CheckoutVerify)
    async with db_session(request) as session:
        user = await current_user(request, session)
        payment = await session.get(Payment, body.payment_id)
        if payment is None:
            raise NotFoundError("Payment not found.")
        invoice = await billing_service.get_invoice(session, payment.invoice_id)
        await _authorize_invoice(invoice, user)

        provider = get_payment_provider()
        verify = getattr(provider, "verify_checkout_signature", None)
        if verify is None:
            raise ValidationError("Online payments are not enabled on this server.")
        if not verify(
            order_id=body.razorpay_order_id,
            payment_id=body.razorpay_payment_id,
            signature=body.razorpay_signature,
        ):
            raise ValidationError("Payment signature could not be verified.")
        payment = await billing_service.confirm_checkout(
            session,
            payment=payment,
            provider_payment_id=body.razorpay_payment_id,
            actor=user,
            request=request,
        )
        await session.commit()
        await session.refresh(payment)
        return json_response(_payment_out(payment))


async def razorpay_webhook(request: Request) -> Response:
    """Razorpay webhook: verify the signature, then capture the matching payment."""
    raw = await request.body()
    provider = get_payment_provider()
    result = await provider.verify_webhook(raw, request.headers)
    if not result.get("accepted"):
        return json_response({"accepted": False, "reason": result.get("reason")}, status_code=202)
    import json

    try:
        event = json.loads(raw or b"{}")
    except json.JSONDecodeError:
        return json_response({"accepted": False, "reason": "invalid json"}, status_code=202)

    entity = (event.get("payload", {}).get("payment", {}) or {}).get("entity", {})
    order_id = entity.get("order_id")
    provider_payment_id = entity.get("id")
    if not order_id or not provider_payment_id:
        return json_response({"accepted": True, "handled": False})

    from sqlalchemy import select as _select

    async with db_session(request) as session:
        payment = await session.scalar(
            _select(Payment).where(Payment.provider_order_id == order_id)
        )
        if payment is None:
            return json_response({"accepted": True, "handled": False})
        await billing_service.confirm_checkout(
            session,
            payment=payment,
            provider_payment_id=provider_payment_id,
            actor=None,
            request=request,
        )
        await session.commit()
        return json_response({"accepted": True, "handled": True})
