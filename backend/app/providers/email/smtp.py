"""SMTP email provider (aiosmtplib).

Works with any SMTP relay, including a self-hosted Postal instance. Configure
via THERAVIVA_SMTP_* settings.
"""

from __future__ import annotations

import uuid
from email.message import EmailMessage

import aiosmtplib

from app.config import settings


class SmtpEmailProvider:
    name = "smtp"

    async def send(self, *, to: str, subject: str, body: str, html: str | None = None) -> str:
        message = EmailMessage()
        message["From"] = settings.email_from
        message["To"] = to
        message["Subject"] = subject
        message["Message-ID"] = f"<{uuid.uuid4().hex}@theraviva>"
        message.set_content(body)
        if html:
            message.add_alternative(html, subtype="html")

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username or None,
            password=settings.smtp_password or None,
            start_tls=settings.smtp_port != 465,
            use_tls=settings.smtp_port == 465,
            timeout=15,
        )
        return message["Message-ID"]
