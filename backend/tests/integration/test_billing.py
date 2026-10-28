"""Billing: invoices, payments, refunds and GST."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_admin_creates_invoice_with_gst_breakdown(client, admin_headers):
    response = await client.post(
        "/api/v1/billing/invoices",
        json={"description": "OT session", "totalInr": 1180},
        headers=admin_headers,
    )
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["totalInr"] == 1180
    assert body["subtotalInr"] == 1000
    assert body["taxInr"] == 180
    assert body["number"].startswith("TV-")


@pytest.mark.asyncio
async def test_patient_cannot_create_invoice(client, patient_headers):
    response = await client.post(
        "/api/v1/billing/invoices",
        json={"description": "x", "totalInr": 100},
        headers=patient_headers,
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_recording_payment_marks_invoice_paid(client, admin_headers):
    invoice = (
        await client.post(
            "/api/v1/billing/invoices",
            json={"description": "Speech assessment", "totalInr": 1200},
            headers=admin_headers,
        )
    ).json()

    payment = await client.post(
        "/api/v1/billing/payments",
        json={"invoiceId": invoice["id"], "amountInr": 1200, "method": "upi"},
        headers=admin_headers,
    )
    assert payment.status_code == 201, payment.text
    assert payment.json()["status"] == "captured"

    fetched = await client.get(f"/api/v1/billing/invoices/{invoice['id']}", headers=admin_headers)
    assert fetched.json()["status"] == "paid"


@pytest.mark.asyncio
async def test_payment_exceeding_total_is_rejected(client, admin_headers):
    invoice = (
        await client.post(
            "/api/v1/billing/invoices",
            json={"description": "x", "totalInr": 500},
            headers=admin_headers,
        )
    ).json()
    response = await client.post(
        "/api/v1/billing/payments",
        json={"invoiceId": invoice["id"], "amountInr": 900, "method": "cash"},
        headers=admin_headers,
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_refund_flow(client, admin_headers):
    invoice = (
        await client.post(
            "/api/v1/billing/invoices",
            json={"description": "x", "totalInr": 600},
            headers=admin_headers,
        )
    ).json()
    payment = (
        await client.post(
            "/api/v1/billing/payments",
            json={"invoiceId": invoice["id"], "amountInr": 600, "method": "upi"},
            headers=admin_headers,
        )
    ).json()

    refund = await client.post(
        "/api/v1/billing/refunds",
        json={"paymentId": payment["id"], "amountInr": 600, "reason": "Cancelled"},
        headers=admin_headers,
    )
    assert refund.status_code == 201
    assert refund.json()["status"] == "processed"


@pytest.mark.asyncio
async def test_refund_cannot_exceed_payment(client, admin_headers):
    invoice = (
        await client.post(
            "/api/v1/billing/invoices",
            json={"description": "x", "totalInr": 400},
            headers=admin_headers,
        )
    ).json()
    payment = (
        await client.post(
            "/api/v1/billing/payments",
            json={"invoiceId": invoice["id"], "amountInr": 400, "method": "upi"},
            headers=admin_headers,
        )
    ).json()
    response = await client.post(
        "/api/v1/billing/refunds",
        json={"paymentId": payment["id"], "amountInr": 500},
        headers=admin_headers,
    )
    assert response.status_code == 422
