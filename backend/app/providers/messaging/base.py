"""Messaging (WhatsApp) provider contract."""

from __future__ import annotations

from typing import Protocol


class MessagingProvider(Protocol):
    name: str

    async def send_text(self, *, to: str, text: str) -> str:
        """Send a plain text message and return a provider message id."""
        ...
