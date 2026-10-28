"""Fake messaging provider — logs instead of sending."""

from __future__ import annotations

import uuid

from app.logging import get_logger

logger = get_logger("app.providers.messaging")


class FakeMessagingProvider:
    name = "fake"

    async def send_text(self, *, to: str, text: str) -> str:
        message_id = f"fake-msg-{uuid.uuid4().hex[:12]}"
        logger.info(
            "whatsapp (fake)",
            extra={"extra_fields": {"to": to, "message_id": message_id}},
        )
        return message_id
