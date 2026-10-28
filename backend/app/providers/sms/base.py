"""SMS sender contract (used for OTP delivery)."""

from __future__ import annotations

from typing import Protocol


class SmsSender(Protocol):
    name: str

    async def send(self, *, to: str, text: str) -> str:
        """Send an SMS and return a provider message id."""
        ...
