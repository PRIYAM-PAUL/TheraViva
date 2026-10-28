"""Notification dispatch with a persistent log.

Delivery is best-effort: a provider failure is recorded on the log row but never
breaks the originating request (a booking must not fail because WhatsApp is
down).
"""

from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import NotificationLog, utcnow
from app.logging import get_logger
from app.providers.registry import get_email_provider, get_messaging_provider

logger = get_logger("app.notifications")


async def dispatch(
    session: AsyncSession,
    *,
    channel: str,
    template: str,
    recipient: str | None,
    body: str,
    subject: str | None = None,
    appointment_id: str | None = None,
    user_id: str | None = None,
) -> NotificationLog:
    entry = NotificationLog(
        id=str(uuid.uuid4()),
        channel=channel,
        template=template,
        recipient=recipient,
        appointment_id=appointment_id,
        user_id=user_id,
        status="queued",
        payload={"subject": subject, "body": body},
        created_at=utcnow(),
    )
    session.add(entry)

    if not recipient:
        entry.status = "skipped"
        entry.error = "No recipient address on file."
        return entry

    try:
        if channel == "email":
            provider_id = await get_email_provider().send(
                to=recipient, subject=subject or "TheraViva", body=body
            )
        elif channel == "whatsapp":
            provider_id = await get_messaging_provider().send_text(to=recipient, text=body)
        else:
            entry.status = "skipped"
            entry.error = f"Unsupported channel '{channel}'."
            return entry
        entry.status = "sent"
        entry.provider_id = provider_id
    except Exception as exc:  # noqa: BLE001 - delivery is best-effort
        entry.status = "failed"
        entry.error = str(exc)[:500]
        logger.warning("notification failed", extra={"extra_fields": {"channel": channel, "template": template}})
    return entry
