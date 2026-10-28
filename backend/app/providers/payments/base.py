"""Payment provider contract.

The interface is deliberately tiny: create a payment, and verify an inbound
webhook. A real gateway (Hyperswitch, Razorpay, a UPI PSP) can be added later
as another implementation without changing callers.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class PaymentIntent:
    id: str
    provider: str
    amount_inr: int
    status: str  # created | authorized | captured | failed
    checkout_url: str | None = None
    provider_payment_id: str | None = None
    raw: dict[str, Any] = field(default_factory=dict)


class PaymentProvider(Protocol):
    name: str

    async def create_payment(
        self, *, invoice_id: str, amount_inr: int, method: str | None, note: str | None
    ) -> PaymentIntent: ...

    async def verify_webhook(
        self, body: bytes, headers: Mapping[str, str]
    ) -> dict[str, Any]: ...
