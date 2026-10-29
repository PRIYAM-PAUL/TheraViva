"""RBAC: reception, therapist and admin permissions across the API."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_reception_can_create_invoice_and_record_payment(client, reception_headers):
    invoice = await client.post(
        "/api/v1/billing/invoices",
        json={"description": "Therapy session", "totalInr": 1500},
        headers=reception_headers,
    )
    assert invoice.status_code == 201, invoice.text
    invoice_id = invoice.json()["id"]

    payment = await client.post(
        "/api/v1/billing/payments",
        json={"invoiceId": invoice_id, "amountInr": 1500, "method": "upi"},
        headers=reception_headers,
    )
    assert payment.status_code == 201, payment.text
    assert payment.json()["status"] == "captured"


@pytest.mark.asyncio
async def test_therapist_cannot_create_invoice(client, therapist_headers):
    response = await client.post(
        "/api/v1/billing/invoices",
        json={"description": "Therapy session", "totalInr": 1500},
        headers=therapist_headers,
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_patient_cannot_list_users(client, patient_headers):
    response = await client.get("/api/v1/admin/users", headers=patient_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_can_create_staff_user(client, admin_headers):
    created = await client.post(
        "/api/v1/admin/users",
        json={
            "email": "new.therapist@theraviva.local",
            "password": "supersecret1",
            "role": "therapist",
            "name": "New Therapist",
        },
        headers=admin_headers,
    )
    assert created.status_code == 201, created.text
    assert created.json()["role"] == "therapist"

    duplicate = await client.post(
        "/api/v1/admin/users",
        json={
            "email": "new.therapist@theraviva.local",
            "password": "supersecret1",
            "role": "therapist",
        },
        headers=admin_headers,
    )
    assert duplicate.status_code == 409


@pytest.mark.asyncio
async def test_checkout_disabled_without_gateway(client, reception_headers):
    invoice = await client.post(
        "/api/v1/billing/invoices",
        json={"description": "Session", "totalInr": 1000},
        headers=reception_headers,
    )
    response = await client.post(
        "/api/v1/billing/payments/razorpay/order",
        json={"invoiceId": invoice.json()["id"]},
        headers=reception_headers,
    )
    # Default provider is `manual`; online checkout must refuse rather than fake a capture.
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_patient_can_cancel_own_appointment(app, client, patient_headers):
    from datetime import date, time, timedelta

    from app.domain.models import AvailabilityRule

    target = date.today() + timedelta(days=1)
    async with app.state.sessionmaker() as session:
        session.add(
            AvailabilityRule(
                id="cancel-rule",
                professional_id="md-irfan",
                mode="video",
                weekday=target.weekday(),
                start_time=time(9, 0),
                end_time=time(17, 0),
                slot_minutes=45,
            )
        )
        await session.commit()

    slots = (
        await client.get(
            "/api/v1/availability",
            params={
                "professional": "md-irfan",
                "mode": "video",
                "from": target.isoformat(),
                "to": target.isoformat(),
            },
        )
    ).json()
    created = await client.post(
        "/api/v1/appointments",
        json={
            "serviceSlug": "occupational-therapy-assessment",
            "professionalId": "md-irfan",
            "mode": "video",
            "startsAt": slots[0]["startsAt"],
        },
        headers=patient_headers,
    )
    reference = created.json()["reference"]

    cancelled = await client.post(
        f"/api/v1/appointments/{reference}/cancel", headers=patient_headers
    )
    assert cancelled.status_code == 200, cancelled.text
    assert cancelled.json()["status"] == "cancelled"
