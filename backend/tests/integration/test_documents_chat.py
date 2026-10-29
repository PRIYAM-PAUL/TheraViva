"""Documents (prescription upload) and chat: access control and happy paths."""

from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_upload_and_download_own_document(client, patient_headers):
    upload = await client.post(
        "/api/v1/documents",
        files={"file": ("rx.pdf", b"%PDF-1.4 prescription", "application/pdf")},
        data={"kind": "prescription"},
        headers=patient_headers,
    )
    assert upload.status_code == 201, upload.text
    document = upload.json()
    assert document["kind"] == "prescription"
    assert document["filename"] == "rx.pdf"

    listing = await client.get("/api/v1/documents", headers=patient_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1

    download = await client.get(f"/api/v1/documents/{document['id']}", headers=patient_headers)
    assert download.status_code == 200
    assert download.content == b"%PDF-1.4 prescription"


@pytest.mark.asyncio
async def test_rejects_disallowed_mime(client, patient_headers):
    upload = await client.post(
        "/api/v1/documents",
        files={"file": ("evil.exe", b"MZ", "application/x-msdownload")},
        headers=patient_headers,
    )
    assert upload.status_code == 422


@pytest.mark.asyncio
async def test_document_requires_auth(client):
    upload = await client.post(
        "/api/v1/documents",
        files={"file": ("rx.pdf", b"%PDF", "application/pdf")},
    )
    assert upload.status_code == 401


@pytest.mark.asyncio
async def test_staff_sees_patient_documents(client, patient_headers, admin_headers):
    await client.post(
        "/api/v1/documents",
        files={"file": ("rx.pdf", b"%PDF", "application/pdf")},
        headers=patient_headers,
    )
    listing = await client.get("/api/v1/documents", headers=admin_headers)
    assert listing.status_code == 200
    assert listing.json()["total"] == 1


@pytest.mark.asyncio
async def test_chat_thread_and_messages(client, patient_headers, admin_headers):
    created = await client.post(
        "/api/v1/chat/threads",
        json={"subject": "Question about my child"},
        headers=patient_headers,
    )
    assert created.status_code == 201, created.text
    thread_id = created.json()["id"]

    posted = await client.post(
        f"/api/v1/chat/threads/{thread_id}/messages",
        json={"body": "Hello, I have a question."},
        headers=patient_headers,
    )
    assert posted.status_code == 201

    reply = await client.post(
        f"/api/v1/chat/threads/{thread_id}/messages",
        json={"body": "Happy to help!"},
        headers=admin_headers,
    )
    assert reply.status_code == 201
    assert reply.json()["senderRole"] == "admin"

    messages = await client.get(
        f"/api/v1/chat/threads/{thread_id}/messages", headers=patient_headers
    )
    assert messages.status_code == 200
    assert len(messages.json()) == 2


@pytest.mark.asyncio
async def test_staff_cannot_start_thread(client, admin_headers):
    response = await client.post(
        "/api/v1/chat/threads", json={"subject": "x"}, headers=admin_headers
    )
    assert response.status_code == 403
