"""Razorpay payment provider (test or live mode).

Implements the tiny ``PaymentProvider`` contract:

- ``create_payment`` creates a Razorpay **order** and returns a ``created`` intent
  carrying the order id, key id and amount so the browser can open Checkout.
- ``verify_webhook`` validates the ``X-Razorpay-Signature`` header.

Signature verification for the client-side Checkout callback lives in
``verify_checkout_signature``. Amounts are whole rupees in our domain and paise
in Razorpay, so conversion happens only here.

This is intentionally gateway-only: it never fabricates a captured payment. A
payment becomes ``captured`` only after a verified signature or webhook.
"""

from __future__ import annotations

import hashlib
import hmac
from collections.abc import Mapping
from typing import Any

import httpx

from app.config import settings
from app.errors import UnavailableError, ValidationError
from app.providers.payments.base import PaymentIntent

API_BASE = "https://api.razorpay.com/v1"
REQUEST_TIMEOUT = 10.0


class RazorpayPaymentProvider:
    name = "razorpay"

    def __init__(
        self,
        *,
        key_id: str | None = None,
        key_secret: str | None = None,
        webhook_secret: str | None = None,
        base_url: str = API_BASE,
    ) -> None:
        self.key_id = key_id if key_id is not None else settings.razorpay_key_id
        self.key_secret = key_secret if key_secret is not None else settings.razorpay_key_secret
        self.webhook_secret = (
            webhook_secret if webhook_secret is not None else settings.razorpay_webhook_secret
        )
        self.base_url = base_url

    def _require_keys(self) -> None:
        if not self.key_id or not self.key_secret:
            raise UnavailableError(
                "Razorpay is not configured. Set THERAVIVA_RAZORPAY_KEY_ID and "
                "THERAVIVA_RAZORPAY_KEY_SECRET."
            )

    async def create_payment(
        self, *, invoice_id: str, amount_inr: int, method: str | None, note: str | None
    ) -> PaymentIntent:
        self._require_keys()
        payload: dict[str, Any] = {
            "amount": int(amount_inr) * 100,
            "currency": "INR",
            "receipt": invoice_id[:40],
            "notes": {"invoiceId": invoice_id, "method": method or "any", "note": note or ""},
        }
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                response = await client.post(
                    f"{self.base_url}/orders",
                    auth=(self.key_id, self.key_secret),
                    json=payload,
                )
        except httpx.HTTPError as exc:  # pragma: no cover - network failure
            raise UnavailableError("Could not reach Razorpay. Please try again.") from exc

        if response.status_code >= 400:
            raise ValidationError("Razorpay rejected the payment request.")
        body = response.json()
        order_id = str(body.get("id"))
        return PaymentIntent(
            id=order_id,
            provider=self.name,
            amount_inr=int(amount_inr),
            status="created",
            checkout_url=None,
            provider_payment_id=None,
            raw={
                "orderId": order_id,
                "keyId": self.key_id,
                "amount": payload["amount"],
                "currency": "INR",
                "invoiceId": invoice_id,
            },
        )

    def verify_checkout_signature(
        self, *, order_id: str, payment_id: str, signature: str
    ) -> bool:
        """Validate the signature returned by Checkout to the browser."""
        if not self.key_secret:
            return False
        expected = hmac.new(
            self.key_secret.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature or "")

    async def verify_webhook(self, body: bytes, headers: Mapping[str, str]) -> dict[str, Any]:
        signature = headers.get("x-razorpay-signature") or headers.get("X-Razorpay-Signature") or ""
        if not self.webhook_secret:
            return {"provider": self.name, "accepted": False, "reason": "webhook secret not set"}
        expected = hmac.new(self.webhook_secret.encode(), body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return {"provider": self.name, "accepted": False, "reason": "signature mismatch"}
        return {"provider": self.name, "accepted": True}
