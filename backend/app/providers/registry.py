"""Runtime provider selection.

Each getter returns a process-wide singleton chosen from settings. Tests can
call the ``set_*`` helpers to inject fakes, or construct providers directly.
"""

from __future__ import annotations

from functools import lru_cache

from app.config import settings
from app.providers.email.base import EmailProvider
from app.providers.email.fake import FakeEmailProvider
from app.providers.email.smtp import SmtpEmailProvider
from app.providers.messaging.base import MessagingProvider
from app.providers.messaging.fake import FakeMessagingProvider
from app.providers.messaging.waha import WahaMessagingProvider
from app.providers.payments.base import PaymentProvider
from app.providers.payments.fake import FakePaymentProvider
from app.providers.payments.manual import ManualPaymentProvider
from app.providers.sms.base import SmsSender
from app.providers.sms.console import ConsoleSmsSender, FakeSmsSender
from app.providers.storage.base import Storage
from app.providers.storage.local import LocalStorage


@lru_cache
def get_payment_provider() -> PaymentProvider:
    if settings.payment_provider == "fake":
        return FakePaymentProvider()
    return ManualPaymentProvider()


@lru_cache
def get_email_provider() -> EmailProvider:
    if settings.email_provider == "smtp":
        return SmtpEmailProvider()
    return FakeEmailProvider()


@lru_cache
def get_messaging_provider() -> MessagingProvider:
    if settings.messaging_provider == "waha":
        return WahaMessagingProvider()
    return FakeMessagingProvider()


@lru_cache
def get_sms_sender() -> SmsSender:
    if settings.sms_provider == "fake":
        return FakeSmsSender()
    return ConsoleSmsSender()


@lru_cache
def get_storage() -> Storage:
    return LocalStorage()


def reset_providers() -> None:
    """Clear cached providers (used between tests)."""
    for getter in (
        get_payment_provider,
        get_email_provider,
        get_messaging_provider,
        get_sms_sender,
        get_storage,
    ):
        getter.cache_clear()
