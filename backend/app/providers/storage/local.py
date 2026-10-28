"""Local filesystem storage.

Keys are sanitised to prevent path traversal. The interface is small enough that
an S3/MinIO implementation can be dropped in without touching callers.
"""

from __future__ import annotations

from pathlib import Path

from app.config import settings
from app.errors import NotFoundError


class LocalStorage:
    name = "local"

    def __init__(self, root: str | None = None) -> None:
        self.root = Path(root or settings.storage_dir).resolve()
        self.root.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        safe = key.replace("..", "").lstrip("/")
        target = (self.root / safe).resolve()
        if not str(target).startswith(str(self.root)):
            raise NotFoundError("Invalid storage key.")
        return target

    async def put(self, key: str, data: bytes, content_type: str) -> str:
        path = self._path(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return key

    async def get(self, key: str) -> bytes:
        path = self._path(key)
        if not path.exists():
            raise NotFoundError("File not found.")
        return path.read_bytes()

    def exists(self, key: str) -> bool:
        return self._path(key).exists()
