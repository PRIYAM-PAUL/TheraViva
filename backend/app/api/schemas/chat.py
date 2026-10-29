"""Chat schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import Field

from app.api.schemas.base import APIModel


class ThreadCreate(APIModel):
    subject: str = Field(default="General enquiry", max_length=160)


class ThreadOut(APIModel):
    id: str
    patient_user_id: str
    subject: str
    status: str
    last_message_at: datetime | None = None
    created_at: datetime
    unread_count: int = 0


class MessageCreate(APIModel):
    body: str = Field(min_length=1, max_length=4000)


class MessageOut(APIModel):
    id: str
    thread_id: str
    sender_user_id: str | None = None
    sender_role: str
    body: str
    created_at: datetime
    read_at: datetime | None = None
