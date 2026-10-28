"""Fake payment provider for tests and local development."""

from __future__ import annotations

import uuid
from collections.abc import Mapping
from typing import Any

from app.providers.payments.base import PaymentIntent


class FakePaymentProvider:
    name = "fake"

    def __init__(self, *, auto_capture: bool = True) -> None:
        self.auto_capture = auto_capture

    async def create_payment(
        self, *, invoice_id: str, amount_inr: int, method: str | None, note: str | None
    ) -> PaymentIntent:
        payment_id = f"fake_{uuid.uuid4().hex[:16]}"
        return PaymentIntent(
            id=payment_id,
            provider=self.name,
            amount_inr=amount_inr,
            status="captured" if self.auto_capture else "created",
            checkout_url=None if self.auto_capture else f"https://fake.pay/{payment_id}",
            provider_payment_id=payment_id,
            raw={"invoice_id": invoice_id, "method": method or "upi", "note": note},
        )

    async def verify_webhook(
        self, body: bytes, headers: Mapping[str, str]
    ) -> dict[str, Any]:
        return {"provider": self.name, "accepted": True, "event": "payment.captured"}
