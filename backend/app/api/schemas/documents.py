"""Document schemas."""

from __future__ import annotations

from datetime import datetime

from app.api.schemas.base import APIModel


class DocumentOut(APIModel):
    id: str
    owner_user_id: str | None = None
    appointment_id: str | None = None
    kind: str
    filename: str
    mime: str | None = None
    size_bytes: int
    created_at: datetime
