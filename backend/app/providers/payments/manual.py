"""Manual payment provider — records offline payments (UPI transfer, cash, POS).

This is the default while the practice has no payment gateway. It marks the
payment as captured immediately because staff have confirmed receipt out of
band; it never claims an online authorisation.
"""

from __future__ import annotations

import uuid
from collections.abc import Mapping
from typing import Any

from app.providers.payments.base import PaymentIntent


class ManualPaymentProvider:
    name = "manual"

    async def create_payment(
        self, *, invoice_id: str, amount_inr: int, method: str | None, note: str | None
    ) -> PaymentIntent:
        payment_id = f"man_{uuid.uuid4().hex[:16]}"
        return PaymentIntent(
            id=payment_id,
            provider=self.name,
            amount_inr=amount_inr,
            status="captured",
            provider_payment_id=payment_id,
            raw={"invoice_id": invoice_id, "method": method or "upi", "note": note, "recorded": "offline"},
        )

    async def verify_webhook(
        self, body: bytes, headers: Mapping[str, str]
    ) -> dict[str, Any]:
        return {"provider": self.name, "accepted": False, "reason": "manual provider has no webhooks"}
