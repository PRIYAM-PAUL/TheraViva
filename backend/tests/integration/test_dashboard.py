"""Dashboard and analytics tests."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_patient_dashboard_empty_state(client, patient_headers):
    response = await client.get("/api/v1/dashboard/patient", headers=patient_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["hasRecords"] is False
    assert body["outstandingInr"] == 0
    assert body["upcomingAppointments"] == []


@pytest.mark.asyncio
async def test_patient_dashboard_requires_auth(client):
    assert (await client.get("/api/v1/dashboard/patient")).status_code == 401


@pytest.mark.asyncio
async def test_admin_dashboard_has_kpis(client, admin_headers):
    response = await client.get("/api/v1/dashboard/admin", headers=admin_headers)
    assert response.status_code == 200
    body = response.json()
    keys = {kpi["key"] for kpi in body["kpis"]}
    assert {"appointments_total", "revenue_collected", "page_views", "seo_clicks"} <= keys
    assert "appointmentsByStatus" in body
    assert "revenueByDay" in body
    assert body["hasRecords"] is False


@pytest.mark.asyncio
async def test_admin_dashboard_requires_admin(client, patient_headers):
    assert (await client.get("/api/v1/dashboard/admin", headers=patient_headers)).status_code == 403


@pytest.mark.asyncio
async def test_admin_dashboard_reflects_records(client, admin_headers, appointment_request_payload):
    await client.post("/api/v1/intake/appointment-requests", json=appointment_request_payload)
    await client.post(
        "/api/v1/billing/invoices",
        json={"description": "Session", "totalInr": 1180},
        headers=admin_headers,
    )
    response = await client.get("/api/v1/dashboard/admin", headers=admin_headers)
    body = response.json()
    assert body["hasRecords"] is True
    assert body["intakeByKind"]["appointment-requests"] == 1
    outstanding = next(k for k in body["kpis"] if k["key"] == "outstanding")
    assert outstanding["value"] == 1180


@pytest.mark.asyncio
async def test_engagement_event_ingestion(client):
    response = await client.post(
        "/api/v1/analytics/events",
        json={"eventType": "page_view", "path": "/", "sessionId": "abc", "device": "mobile"},
    )
    assert response.status_code == 202
    assert response.json()["recorded"] is True


@pytest.mark.asyncio
async def test_engagement_event_rejects_unknown_type(client):
    response = await client.post("/api/v1/analytics/events", json={"eventType": "nonsense"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_seo_snapshot_requires_admin(client, patient_headers):
    response = await client.post(
        "/api/v1/analytics/seo",
        json={"snapshotDate": "2026-01-01", "page": "/", "impressions": 10, "clicks": 1},
        headers=patient_headers,
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_seo_snapshot_round_trip(client, admin_headers):
    created = await client.post(
        "/api/v1/analytics/seo",
        json={
            "snapshotDate": "2026-01-01",
            "page": "/services",
            "impressions": 120,
            "clicks": 12,
            "ctr": 0.1,
            "position": 4.2,
        },
        headers=admin_headers,
    )
    assert created.status_code == 201

    listing = await client.get("/api/v1/analytics/seo", headers=admin_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1


@pytest.mark.asyncio
async def test_engagement_feeds_admin_dashboard(client, admin_headers):
    await client.post("/api/v1/analytics/events", json={"eventType": "page_view", "path": "/"})
    await client.post("/api/v1/analytics/events", json={"eventType": "booking_submitted", "path": "/book"})
    response = await client.get("/api/v1/dashboard/admin", headers=admin_headers)
    body = response.json()
    views = next(k for k in body["kpis"] if k["key"] == "page_views")
    leads = next(k for k in body["kpis"] if k["key"] == "leads")
    assert views["value"] == 1
    assert leads["value"] == 1
    assert body["topPages"][0]["path"] == "/"
