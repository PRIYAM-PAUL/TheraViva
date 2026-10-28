"""Operational and standards endpoints.

Paths are fixed by ``src/config/endpoints.ts`` on the frontend: liveness,
readiness, version, Prometheus metrics and the RFC 8615 well-known documents.
"""

from __future__ import annotations

import platform
import sys
from datetime import UTC, datetime, timedelta

from sqlalchemy import text
from starlette.requests import Request
from starlette.responses import PlainTextResponse, RedirectResponse, Response

from app import __version__
from app.api.deps import db_session
from app.api.responses import json_response
from app.config import settings
from app.metrics import READY, content_type, render


async def healthz(request: Request) -> Response:
    """Liveness: the process is up. Does not touch the database."""
    return json_response({"status": "ok"})


async def readyz(request: Request) -> Response:
    """Readiness: the database answers, so traffic can be served."""
    try:
        async with db_session(request) as session:
            await session.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001 - any failure means "not ready"
        READY.set(0)
        return json_response({"status": "unavailable", "database": "down"}, status_code=503)
    READY.set(1)
    return json_response({"status": "ready", "database": "up"})


async def version(request: Request) -> Response:
    return json_response(
        {
            "name": settings.site_name,
            "version": __version__,
            "env": settings.env,
            "python": sys.version.split()[0],
            "platform": platform.platform(),
        }
    )


async def metrics(request: Request) -> Response:
    return Response(content=render(), media_type=content_type())


async def security_txt(request: Request) -> Response:
    expires = (datetime.now(UTC) + timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = "\n".join(
        [
            "# Our security policy",
            f"Contact: mailto:{settings.admin_email}",
            f"Expires: {expires}",
            "Preferred-Languages: en",
            f"Canonical: {settings.frontend_url}/.well-known/security.txt",
            "",
        ]
    )
    return PlainTextResponse(body)


async def change_password(request: Request) -> Response:
    """RFC 8615 Change Password URL: redirect to the account page."""
    return RedirectResponse(f"{settings.frontend_url}/account/password", status_code=302)
