"""Operational and standards endpoint tests."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_healthz(client):
    response = await client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_readyz_reports_database_up(client):
    response = await client.get("/readyz")
    assert response.status_code == 200
    assert response.json() == {"status": "ready", "database": "up"}


@pytest.mark.asyncio
async def test_version(client):
    response = await client.get("/version")
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "TheraViva"
    assert "version" in body


@pytest.mark.asyncio
async def test_metrics_prometheus_text(client):
    response = await client.get("/metrics")
    assert response.status_code == 200
    assert "theraviva_http_requests_total" in response.text


@pytest.mark.asyncio
async def test_security_txt(client):
    response = await client.get("/.well-known/security.txt")
    assert response.status_code == 200
    assert "Contact: mailto:" in response.text


@pytest.mark.asyncio
async def test_change_password_redirect(client):
    response = await client.get("/.well-known/change-password", follow_redirects=False)
    assert response.status_code == 302


@pytest.mark.asyncio
async def test_request_id_header_is_echoed(client):
    response = await client.get("/healthz", headers={"X-Request-ID": "abc123"})
    assert response.headers["x-request-id"] == "abc123"


@pytest.mark.asyncio
async def test_security_headers_present(client):
    response = await client.get("/healthz")
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"


@pytest.mark.asyncio
async def test_unknown_route_returns_404(client):
    response = await client.get("/api/v1/does-not-exist")
    assert response.status_code == 404
