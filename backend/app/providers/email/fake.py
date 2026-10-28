"""Fake email provider — logs the message instead of sending it."""

from __future__ import annotations

import uuid

from app.logging import get_logger

logger = get_logger("app.providers.email")


class FakeEmailProvider:
    name = "fake"

    async def send(self, *, to: str, subject: str, body: str, html: str | None = None) -> str:
        message_id = f"fake-mail-{uuid.uuid4().hex[:12]}"
        logger.info(
            "email (fake)",
            extra={"extra_fields": {"to": to, "subject": subject, "message_id": message_id}},
        )
        return message_id
