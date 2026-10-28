"""Structured JSON logging with request-id correlation and PHI redaction.

Every log record is emitted as a single JSON object so it can be shipped to a
log aggregator and filtered by field. A redaction filter removes anything that
looks like an email address or a phone number, and drops a configured set of
sensitive keys, so patient data never lands in the logs (see the project's PHI
rules).
"""

from __future__ import annotations

import json
import logging
import re
import sys
from contextvars import ContextVar
from datetime import UTC, datetime
from typing import Any

request_id_ctx: ContextVar[str | None] = ContextVar("request_id", default=None)

_EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
_PHONE_RE = re.compile(r"(?<!\d)(?:\+?\d[\d\s().-]{6,}\d)(?!\d)")
_REDACT_KEYS = {
    "password",
    "password_hash",
    "code",
    "code_hash",
    "token",
    "token_hash",
    "secret",
    "authorization",
    "api_key",
    "phone",
    "email",
    "patient_name",
    "full_name",
    "notes",
    "message",
}


def _redact_value(value: Any) -> Any:
    if isinstance(value, str):
        value = _EMAIL_RE.sub("[redacted-email]", value)
        value = _PHONE_RE.sub("[redacted-phone]", value)
        return value
    if isinstance(value, dict):
        return {key: ("[redacted]" if key in _REDACT_KEYS else _redact_value(val)) for key, val in value.items()}
    if isinstance(value, (list, tuple)):
        return [_redact_value(item) for item in value]
    return value


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "ts": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": _redact_value(record.getMessage()),
        }
        rid = request_id_ctx.get()
        if rid:
            payload["request_id"] = rid
        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)
        extra = getattr(record, "extra_fields", None)
        if isinstance(extra, dict):
            payload.update(_redact_value(extra))
        return json.dumps(payload, default=str)


def configure_logging(level: str | None = None) -> None:
    root = logging.getLogger()
    root.handlers.clear()
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root.addHandler(handler)
    root.setLevel(level or "INFO")
    # Uvicorn's access log duplicates our structured request log.
    logging.getLogger("uvicorn.access").disabled = True
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
