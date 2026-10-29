"""Shared pytest fixtures.

Tests run against a fully wired app instance backed by an isolated in-memory
SQLite database, so no lifespan, filesystem or network access is required.
"""

from __future__ import annotations

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.config import settings
from app.domain.models import Base
from app.domain.services import auth as auth_service
from app.main import create_app
from app.providers.registry import reset_providers
from app.seed.loader import seed_catalog

PATIENT_PHONE = "9876543210"


@pytest_asyncio.fixture
async def app():
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    application = create_app()
    application.state.engine = engine
    application.state.sessionmaker = async_sessionmaker(engine, expire_on_commit=False)

    async with application.state.sessionmaker() as session:
        await seed_catalog(session)
        await auth_service.ensure_admin_bootstrap(session)
        await auth_service.ensure_staff_bootstrap(session)

    yield application

    await engine.dispose()
    reset_providers()


@pytest_asyncio.fixture
async def client(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        yield http


@pytest_asyncio.fixture
async def admin_headers(client) -> dict[str, str]:
    response = await client.post(
        "/api/v1/auth/staff/login",
        json={"email": settings.admin_email, "password": settings.admin_password},
    )
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['accessToken']}"}


@pytest_asyncio.fixture
async def patient_headers(client) -> dict[str, str]:
    requested = await client.post("/api/v1/auth/otp/request", json={"phone": PATIENT_PHONE})
    assert requested.status_code == 200, requested.text
    code = requested.json()["devCode"]
    verified = await client.post(
        "/api/v1/auth/otp/verify",
        json={"phone": PATIENT_PHONE, "code": code, "name": "Test Patient"},
    )
    assert verified.status_code == 200, verified.text
    return {"Authorization": f"Bearer {verified.json()['accessToken']}"}


async def _staff_headers(client, email: str, password: str) -> dict[str, str]:
    response = await client.post(
        "/api/v1/auth/staff/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['accessToken']}"}


@pytest_asyncio.fixture
async def reception_headers(client) -> dict[str, str]:
    return await _staff_headers(client, settings.reception_email, settings.reception_password)


@pytest_asyncio.fixture
async def therapist_headers(client) -> dict[str, str]:
    return await _staff_headers(client, settings.therapist_email, settings.therapist_password)


@pytest.fixture
def appointment_request_payload() -> dict:
    return {
        "mode": "video",
        "serviceSlug": "occupational-therapy-assessment",
        "professionalId": "md-irfan",
        "preferredDate": "",
        "preferredTime": "morning",
        "fullName": "Test Parent",
        "phone": "9876500000",
        "email": "parent@example.com",
        "patientName": "Test Child",
        "notes": "",
        "consent": True,
    }
