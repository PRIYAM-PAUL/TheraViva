"""Email provider contract."""

from __future__ import annotations

from typing import Protocol


class EmailProvider(Protocol):
    name: str

    async def send(self, *, to: str, subject: str, body: str, html: str | None = None) -> str:
        """Send an email and return a provider message id."""
        ...
