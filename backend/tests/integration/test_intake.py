"""Intake (appointment request / enquiry / referral) tests."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_create_appointment_request(client, appointment_request_payload):
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["status"] == "received"
    assert body["reference"].startswith("TV-")
    assert body["kind"] == "appointment-request"


@pytest.mark.asyncio
async def test_request_requires_consent(client, appointment_request_payload):
    appointment_request_payload["consent"] = False
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422
    assert response.json().get("errors") is not None


@pytest.mark.asyncio
async def test_request_rejects_unknown_service(client, appointment_request_payload):
    appointment_request_payload["serviceSlug"] = "does-not-exist"
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_request_rejects_past_date(client, appointment_request_payload):
    appointment_request_payload["preferredDate"] = "2000-01-01"
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_request_rejects_date_beyond_horizon(client, appointment_request_payload):
    from datetime import date, timedelta

    appointment_request_payload["preferredDate"] = (date.today() + timedelta(days=200)).isoformat()
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_request_rejects_short_phone(client, appointment_request_payload):
    appointment_request_payload["phone"] = "123"
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_request_rejects_invalid_time_window(client, appointment_request_payload):
    appointment_request_payload["preferredTime"] = "midnight"
    response = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_enquiry(client):
    response = await client.post(
        "/api/v1/intake/enquiries",
        json={
            "name": "A Parent",
            "email": "parent@example.com",
            "phone": "",
            "message": "Do you offer home visits in South Delhi?",
            "consent": True,
        },
    )
    assert response.status_code == 201
    assert response.json()["reference"].startswith("TVE-")


@pytest.mark.asyncio
async def test_enquiry_requires_a_contact_method(client):
    response = await client.post(
        "/api/v1/intake/enquiries",
        json={"name": "A Parent", "email": "", "phone": "", "message": "Hello there", "consent": True},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_referral(client):
    response = await client.post(
        "/api/v1/intake/referrals",
        json={
            "referrerName": "Dr Sharma",
            "referrerRole": "Paediatrician",
            "clientName": "Child A",
            "clientAge": "4",
            "concerns": "Speech delay",
            "consent": True,
        },
    )
    assert response.status_code == 201
    assert response.json()["reference"].startswith("TVR-")


@pytest.mark.asyncio
async def test_admin_can_list_and_update_intake(client, admin_headers, appointment_request_payload):
    created = await client.post(
        "/api/v1/intake/appointment-requests", json=appointment_request_payload
    )
    record_id = created.json()["id"]

    listing = await client.get("/api/v1/admin/intake/appointment-requests", headers=admin_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1

    updated = await client.patch(
        f"/api/v1/admin/intake/appointment-requests/{record_id}",
        json={"status": "contacted"},
        headers=admin_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["status"] == "contacted"


@pytest.mark.asyncio
async def test_intake_listing_requires_admin(client):
    response = await client.get("/api/v1/admin/intake/appointment-requests")
    assert response.status_code == 401
