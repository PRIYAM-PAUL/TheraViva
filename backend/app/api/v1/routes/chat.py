"""Chat routes: patient ↔ clinic messaging.

Patients create their own threads and see only those; staff see every thread and
can reply. Message reads are polled with ``?after=<messageId>`` so the client can
fetch only what is new.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import Response

from app.api.deps import current_user, db_session, pagination, read_json
from app.api.responses import json_response, page_payload
from app.api.schemas.chat import MessageCreate, MessageOut, ThreadCreate, ThreadOut
from app.domain.models import STAFF_ROLES, ChatMessage, ChatThread
from app.domain.services import chat as chat_service
from app.errors import ForbiddenError


async def _thread_out(session: AsyncSession, thread: ChatThread, *, staff: bool) -> ThreadOut:
    return ThreadOut(
        id=thread.id,
        patient_user_id=thread.patient_user_id,
        subject=thread.subject,
        status=thread.status,
        last_message_at=thread.last_message_at,
        created_at=thread.created_at,
        unread_count=await chat_service.unread_count(session, thread_id=thread.id, staff=staff),
    )


def _message_out(message: ChatMessage) -> MessageOut:
    return MessageOut(
        id=message.id,
        thread_id=message.thread_id,
        sender_user_id=message.sender_user_id,
        sender_role=message.sender_role,
        body=message.body,
        created_at=message.created_at,
        read_at=message.read_at,
    )


async def create_thread(request: Request) -> Response:
    body = await read_json(request, ThreadCreate)
    async with db_session(request) as session:
        user = await current_user(request, session)
        if user.role in STAFF_ROLES:
            raise ForbiddenError("Only patients start conversations.")
        thread = await chat_service.create_thread(
            session, patient_user_id=user.id, subject=body.subject
        )
        await session.commit()
        await session.refresh(thread)
        return json_response(await _thread_out(session, thread, staff=False), status_code=201)


async def list_threads(request: Request) -> Response:
    limit, offset = pagination(request)
    async with db_session(request) as session:
        user = await current_user(request, session)
        staff = user.role in STAFF_ROLES
        rows, total = await chat_service.list_threads(
            session,
            patient_user_id=None if staff else user.id,
            limit=limit,
            offset=offset,
        )
        items = [await _thread_out(session, thread, staff=staff) for thread in rows]
        return json_response(page_payload(items, total, limit, offset))


async def list_messages(request: Request) -> Response:
    thread_id = request.path_params["thread_id"]
    after = request.query_params.get("after")
    async with db_session(request) as session:
        user = await current_user(request, session)
        staff = user.role in STAFF_ROLES
        thread = await chat_service.get_thread(session, thread_id)
        chat_service.authorize(thread, user, staff=staff)
        rows = await chat_service.list_messages(session, thread_id=thread.id, after=after)
        return json_response([_message_out(m) for m in rows])


async def post_message(request: Request) -> Response:
    thread_id = request.path_params["thread_id"]
    body = await read_json(request, MessageCreate)
    async with db_session(request) as session:
        user = await current_user(request, session)
        staff = user.role in STAFF_ROLES
        thread = await chat_service.get_thread(session, thread_id)
        chat_service.authorize(thread, user, staff=staff)
        message = await chat_service.post_message(session, thread=thread, sender=user, body=body.body)
        await session.commit()
        await session.refresh(message)
        return json_response(_message_out(message), status_code=201)


async def mark_thread_read(request: Request) -> Response:
    thread_id = request.path_params["thread_id"]
    async with db_session(request) as session:
        user = await current_user(request, session)
        staff = user.role in STAFF_ROLES
        thread = await chat_service.get_thread(session, thread_id)
        chat_service.authorize(thread, user, staff=staff)
        count = await chat_service.mark_read(session, thread=thread, reader=user, staff=staff)
        await session.commit()
        return json_response({"markedRead": count})
