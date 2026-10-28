"""Console SMS sender — logs the message. Used in development for OTP."""

from __future__ import annotations

import uuid

from app.logging import get_logger

logger = get_logger("app.providers.sms")


class ConsoleSmsSender:
    name = "console"

    async def send(self, *, to: str, text: str) -> str:
        message_id = f"console-{uuid.uuid4().hex[:12]}"
        # The OTP itself is intentionally not logged in production; in dev this
        # is the delivery mechanism, so the text is emitted at INFO.
        logger.info(
            "sms (console)",
            extra={"extra_fields": {"to": to, "text": text, "message_id": message_id}},
        )
        return message_id


class FakeSmsSender:
    name = "fake"

    def __init__(self) -> None:
        self.sent: list[tuple[str, str]] = []

    async def send(self, *, to: str, text: str) -> str:
        self.sent.append((to, text))
        return f"fake-sms-{len(self.sent)}"
