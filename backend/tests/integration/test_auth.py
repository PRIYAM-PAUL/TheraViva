"""Authentication and authorisation tests."""

from __future__ import annotations

import pytest

from tests.conftest import PATIENT_PHONE


@pytest.mark.asyncio
async def test_otp_login_creates_patient(client):
    requested = await client.post("/api/v1/auth/otp/request", json={"phone": PATIENT_PHONE})
    assert requested.status_code == 200
    dev_code = requested.json()["devCode"]
    assert dev_code

    verified = await client.post(
        "/api/v1/auth/otp/verify",
        json={"phone": PATIENT_PHONE, "code": dev_code, "name": "Test Patient"},
    )
    assert verified.status_code == 200, verified.text
    body = verified.json()
    assert body["user"]["role"] == "patient"
    assert body["accessToken"]


@pytest.mark.asyncio
async def test_otp_rejects_wrong_code(client):
    await client.post("/api/v1/auth/otp/request", json={"phone": PATIENT_PHONE})
    response = await client.post(
        "/api/v1/auth/otp/verify", json={"phone": PATIENT_PHONE, "code": "000000"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_current_user(client, patient_headers):
    response = await client.get("/api/v1/auth/me", headers=patient_headers)
    assert response.status_code == 200
    assert response.json()["phone"] == PATIENT_PHONE


@pytest.mark.asyncio
async def test_me_without_token_is_401(client):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_staff_login_wrong_password_is_401(client):
    from app.config import settings

    response = await client.post(
        "/api/v1/auth/staff/login",
        json={"email": settings.admin_email, "password": "definitely-wrong"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_rotates_tokens(client):
    from app.config import settings

    login = await client.post(
        "/api/v1/auth/staff/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
    )
    refresh_token = login.json()["refreshToken"]

    refreshed = await client.post("/api/v1/auth/token/refresh", json={"refreshToken": refresh_token})
    assert refreshed.status_code == 200
    assert refreshed.json()["refreshToken"] != refresh_token

    # The old token must no longer work (rotation).
    reused = await client.post("/api/v1/auth/token/refresh", json={"refreshToken": refresh_token})
    assert reused.status_code == 401


@pytest.mark.asyncio
async def test_logout_revokes_refresh_token(client):
    from app.config import settings

    login = await client.post(
        "/api/v1/auth/staff/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
    )
    refresh_token = login.json()["refreshToken"]
    assert (await client.post("/api/v1/auth/logout", json={"refreshToken": refresh_token})).status_code == 204
    assert (
        await client.post("/api/v1/auth/token/refresh", json={"refreshToken": refresh_token})
    ).status_code == 401


@pytest.mark.asyncio
async def test_patient_cannot_access_admin_routes(client, patient_headers):
    response = await client.get("/api/v1/admin/users", headers=patient_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_route_forbids_anonymous(client):
    assert (await client.get("/api/v1/admin/audit-log")).status_code == 401
