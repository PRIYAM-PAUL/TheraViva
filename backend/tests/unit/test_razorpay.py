"""Razorpay provider: signature verification (no network)."""

from __future__ import annotations

import hashlib
import hmac
import json

import pytest

from app.providers.payments.razorpay import RazorpayPaymentProvider

KEY_SECRET = "test_secret_key"
WEBHOOK_SECRET = "test_webhook_secret"


def _provider() -> RazorpayPaymentProvider:
    return RazorpayPaymentProvider(
        key_id="rzp_test_123",
        key_secret=KEY_SECRET,
        webhook_secret=WEBHOOK_SECRET,
    )


def test_checkout_signature_round_trip():
    provider = _provider()
    order_id = "order_ABC"
    payment_id = "pay_XYZ"
    signature = hmac.new(
        KEY_SECRET.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256
    ).hexdigest()
    assert provider.verify_checkout_signature(
        order_id=order_id, payment_id=payment_id, signature=signature
    )
    assert not provider.verify_checkout_signature(
        order_id=order_id, payment_id=payment_id, signature="tampered"
    )


@pytest.mark.asyncio
async def test_webhook_accepts_valid_signature():
    provider = _provider()
    body = json.dumps({"event": "payment.captured"}).encode()
    signature = hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    result = await provider.verify_webhook(body, {"x-razorpay-signature": signature})
    assert result["accepted"] is True


@pytest.mark.asyncio
async def test_webhook_rejects_bad_signature():
    provider = _provider()
    result = await provider.verify_webhook(b"{}", {"x-razorpay-signature": "nope"})
    assert result["accepted"] is False
