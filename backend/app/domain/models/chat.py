"""Chat: patient ↔ clinic messaging threads.

A thread belongs to one patient. Staff (reception, therapist or admin) can read
and reply to any thread; a patient sees only their own. Messages are plain text;
attachments reuse the ``Document`` store rather than embedding bytes here.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.domain.models.base import Base, TimestampMixin, UTCDateTime

THREAD_STATUSES = ("open", "closed")


class ChatThread(Base, TimestampMixin):
    __tablename__ = "chat_threads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    patient_user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    subject: Mapped[str] = mapped_column(String(160), default="General enquiry")
    status: Mapped[str] = mapped_column(String(16), default="open", index=True)
    last_message_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    thread_id: Mapped[str] = mapped_column(
        ForeignKey("chat_threads.id", ondelete="CASCADE"), index=True
    )
    sender_user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    sender_role: Mapped[str] = mapped_column(String(16))
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime, index=True)
    read_at: Mapped[datetime | None] = mapped_column(UTCDateTime, nullable=True)
