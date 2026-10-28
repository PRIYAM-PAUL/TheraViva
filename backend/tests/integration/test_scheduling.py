"""Scheduling: availability generation, booking and conflicts."""

from __future__ import annotations

from datetime import date, time, timedelta

import pytest

from app.domain.models import AvailabilityRule


async def _add_rule(app, *, professional="md-irfan", mode="video", weekday=0):
    async with app.state.sessionmaker() as session:
        session.add(
            AvailabilityRule(
                id=f"rule-{weekday}",
                professional_id=professional,
                mode=mode,
                weekday=weekday,
                start_time=time(9, 0),
                end_time=time(17, 0),
                slot_minutes=45,
            )
        )
        await session.commit()


def _tomorrow():
    return date.today() + timedelta(days=1)


@pytest.mark.asyncio
async def test_availability_requires_professional_and_mode(client):
    response = await client.get("/api/v1/availability")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_availability_empty_without_rules(client):
    target = _tomorrow()
    response = await client.get(
        "/api/v1/availability",
        params={
            "professional": "md-irfan",
            "mode": "video",
            "from": target.isoformat(),
            "to": target.isoformat(),
        },
    )
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_availability_generates_slots(app, client):
    target = _tomorrow()
    await _add_rule(app, weekday=target.weekday())
    response = await client.get(
        "/api/v1/availability",
        params={
            "professional": "md-irfan",
            "mode": "video",
            "from": target.isoformat(),
            "to": target.isoformat(),
        },
    )
    assert response.status_code == 200
    slots = response.json()
    assert len(slots) > 0
    assert slots[0]["available"] is True


@pytest.mark.asyncio
async def test_book_slot_and_prevent_double_booking(app, client):
    target = _tomorrow()
    await _add_rule(app, weekday=target.weekday())
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
    starts_at = slots[0]["startsAt"]

    payload = {
        "serviceSlug": "occupational-therapy-assessment",
        "professionalId": "md-irfan",
        "mode": "video",
        "startsAt": starts_at,
    }
    first = await client.post("/api/v1/appointments", json=payload)
    assert first.status_code == 201, first.text
    assert first.json()["status"] == "requested"

    second = await client.post("/api/v1/appointments", json=payload)
    assert second.status_code == 409


@pytest.mark.asyncio
async def test_hold_sets_expiry(app, client):
    target = _tomorrow()
    await _add_rule(app, weekday=target.weekday())
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
    response = await client.post(
        "/api/v1/appointments",
        json={
            "serviceSlug": "occupational-therapy-assessment",
            "professionalId": "md-irfan",
            "mode": "video",
            "startsAt": slots[0]["startsAt"],
            "hold": True,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "held"
    assert body["holdExpiresAt"] is not None


@pytest.mark.asyncio
async def test_reject_past_slot(client):
    response = await client.post(
        "/api/v1/appointments",
        json={
            "serviceSlug": "occupational-therapy-assessment",
            "professionalId": "md-irfan",
            "mode": "video",
            "startsAt": "2000-01-01T09:00:00Z",
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_admin_can_confirm_appointment(app, client, admin_headers):
    target = _tomorrow()
    await _add_rule(app, weekday=target.weekday())
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
    )
    reference = created.json()["reference"]
    confirmed = await client.patch(
        f"/api/v1/appointments/{reference}/status",
        json={"status": "confirmed"},
        headers=admin_headers,
    )
    assert confirmed.status_code == 200
    assert confirmed.json()["status"] == "confirmed"
