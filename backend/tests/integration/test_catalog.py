"""Catalog read API tests."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_list_services_seeded(client):
    response = await client.get("/api/v1/services")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 16
    assert body["items"][0]["kind"] == "service"
    assert "slug" in body["items"][0]


@pytest.mark.asyncio
async def test_get_service_by_slug(client):
    response = await client.get("/api/v1/services/occupational-therapy-assessment")
    assert response.status_code == 200
    body = response.json()
    assert body["slug"] == "occupational-therapy-assessment"
    assert body["data"]["durationMinutes"] == 60


@pytest.mark.asyncio
async def test_unknown_service_returns_problem_json(client):
    response = await client.get("/api/v1/services/not-a-service")
    assert response.status_code == 404
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["title"] == "Not found"


@pytest.mark.asyncio
async def test_catalog_bootstrap_returns_every_kind(client):
    response = await client.get("/api/v1/catalog")
    assert response.status_code == 200
    body = response.json()
    assert len(body["service"]) == 16
    assert len(body["condition"]) == 15
    assert len(body["professional"]) == 2
    assert len(body["blog_post"]) == 4


@pytest.mark.asyncio
async def test_conditions_filtered_by_discipline(client):
    response = await client.get("/api/v1/conditions", params={"discipline": "audiology"})
    assert response.status_code == 200
    for item in response.json()["items"]:
        assert item["discipline"] == "audiology"


@pytest.mark.asyncio
async def test_unknown_catalog_kind_is_422(client):
    response = await client.get("/api/v1/catalog/bananas")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_admin_can_upsert_and_delete_catalog_item(client, admin_headers):
    payload = {"title": "Test Condition", "data": {"summary": "x"}, "discipline": "audiology"}
    created = await client.put(
        "/api/v1/admin/catalog/condition/test-condition", json=payload, headers=admin_headers
    )
    assert created.status_code == 200, created.text
    assert created.json()["slug"] == "test-condition"

    deleted = await client.delete(
        "/api/v1/admin/catalog/condition/test-condition", headers=admin_headers
    )
    assert deleted.status_code == 204


@pytest.mark.asyncio
async def test_catalog_write_requires_admin(client):
    response = await client.put(
        "/api/v1/admin/catalog/condition/x", json={"title": "x", "data": {}}
    )
    assert response.status_code == 401
