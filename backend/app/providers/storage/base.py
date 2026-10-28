"""Storage contract for documents and generated invoice files."""

from __future__ import annotations

from typing import Protocol


class Storage(Protocol):
    name: str

    async def put(self, key: str, data: bytes, content_type: str) -> str:
        """Store bytes under ``key`` and return the storage key."""
        ...

    async def get(self, key: str) -> bytes:
        """Read bytes for ``key``."""
        ...

    def exists(self, key: str) -> bool: ...
