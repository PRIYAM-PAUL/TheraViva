"""In-process fixed-window rate limiting.

A single-process limiter is appropriate for this deployment (one uvicorn worker).
Keys are ``client-ip:route-group`` so a noisy endpoint cannot exhaust another's
budget. Health probes and static docs are exempt.
"""

from __future__ import annotations

import time
from collections import defaultdict

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import settings
from app.errors import PROBLEM_CONTENT_TYPE

_EXEMPT_PREFIXES = ("/healthz", "/readyz", "/metrics", "/version", "/.well-known")


class _Window:
    __slots__ = ("count", "reset_at")

    def __init__(self, reset_at: float) -> None:
        self.count = 0
        self.reset_at = reset_at


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit_per_minute: int | None = None) -> None:
        super().__init__(app)
        self.limit = limit_per_minute or settings.rate_limit_per_minute
        self._windows: dict[str, _Window] = defaultdict(lambda: _Window(time.time() + 60))

    def _client_key(self, request: Request) -> str:
        if request.client and request.client.host:
            return request.client.host
        return "unknown"

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        path = request.url.path
        if path.startswith(_EXEMPT_PREFIXES) or self.limit <= 0:
            return await call_next(request)

        now = time.time()
        key = self._client_key(request)
        window = self._windows[key]
        if now >= window.reset_at:
            window.count = 0
            window.reset_at = now + 60
        window.count += 1
        if window.count > self.limit:
            retry_after = max(1, int(window.reset_at - now))
            return JSONResponse(
                {
                    "type": "https://theraviva.local/problems/rate_limited",
                    "title": "Too many requests",
                    "status": 429,
                    "detail": "Rate limit exceeded. Please retry shortly.",
                    "instance": path,
                    "retry_after": retry_after,
                },
                status_code=429,
                media_type=PROBLEM_CONTENT_TYPE,
                headers={"Retry-After": str(retry_after)},
            )
        return await call_next(request)
