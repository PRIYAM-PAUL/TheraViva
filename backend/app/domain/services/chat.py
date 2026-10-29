"""Chat service: threads and messages."""

from __future__ import annotations

import uuid
from collections.abc import Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import ChatMessage, ChatThread, User, utcnow
from app.errors import ForbiddenError, NotFoundError, ValidationError

MAX_BODY = 4000


async def create_thread(session: AsyncSession, *, patient_user_id: str, subject: str) -> ChatThread:
    thread = ChatThread(
        id=str(uuid.uuid4()),
        patient_user_id=patient_user_id,
        subject=(subject or "General enquiry")[:160],
        status="open",
    )
    session.add(thread)
    await session.flush()
    return thread


async def get_thread(session: AsyncSession, thread_id: str) -> ChatThread:
    thread = await session.get(ChatThread, thread_id)
    if thread is None:
        raise NotFoundError("Conversation not found.")
    return thread


def authorize(thread: ChatThread, user: User, *, staff: bool) -> None:
    if staff:
        return
    if thread.patient_user_id != user.id:
        raise ForbiddenError("This conversation belongs to another patient.")


async def list_threads(
    session: AsyncSession, *, patient_user_id: str | None, limit: int = 50, offset: int = 0
) -> tuple[Sequence[ChatThread], int]:
    stmt = select(ChatThread)
    if patient_user_id:
        stmt = stmt.where(ChatThread.patient_user_id == patient_user_id)
    stmt = stmt.order_by(
        func.coalesce(ChatThread.last_message_at, ChatThread.created_at).desc()
    )
    rows = (await session.scalars(stmt.limit(limit).offset(offset))).all()
    return rows, len(rows)


async def list_messages(
    session: AsyncSession, *, thread_id: str, after: str | None = None
) -> Sequence[ChatMessage]:
    stmt = select(ChatMessage).where(ChatMessage.thread_id == thread_id)
    if after:
        cursor = await session.get(ChatMessage, after)
        if cursor is not None:
            stmt = stmt.where(ChatMessage.created_at > cursor.created_at)
    stmt = stmt.order_by(ChatMessage.created_at.asc())
    return (await session.scalars(stmt.limit(500))).all()


async def post_message(
    session: AsyncSession, *, thread: ChatThread, sender: User, body: str
) -> ChatMessage:
    text = (body or "").strip()
    if not text:
        raise ValidationError("A message cannot be empty.")
    if len(text) > MAX_BODY:
        raise ValidationError("Messages must be 4000 characters or fewer.")
    now = utcnow()
    message = ChatMessage(
        id=str(uuid.uuid4()),
        thread_id=thread.id,
        sender_user_id=sender.id,
        sender_role=sender.role,
        body=text,
        created_at=now,
    )
    session.add(message)
    thread.last_message_at = now
    if thread.status == "closed":
        thread.status = "open"
    return message


async def mark_read(
    session: AsyncSession, *, thread: ChatThread, reader: User, staff: bool
) -> int:
    """Mark messages from the other side as read. Returns how many changed."""
    stmt = select(ChatMessage).where(ChatMessage.thread_id == thread.id, ChatMessage.read_at.is_(None))
    if staff:
        stmt = stmt.where(ChatMessage.sender_role == "patient")
    else:
        stmt = stmt.where(ChatMessage.sender_role != "patient")
    rows = (await session.scalars(stmt)).all()
    now = utcnow()
    for message in rows:
        message.read_at = now
    return len(rows)


async def unread_count(session: AsyncSession, *, thread_id: str, staff: bool) -> int:
    stmt = select(func.count()).select_from(ChatMessage).where(
        ChatMessage.thread_id == thread_id, ChatMessage.read_at.is_(None)
    )
    if staff:
        stmt = stmt.where(ChatMessage.sender_role == "patient")
    else:
        stmt = stmt.where(ChatMessage.sender_role != "patient")
    return int(await session.scalar(stmt) or 0)
