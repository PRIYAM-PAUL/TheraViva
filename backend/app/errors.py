"""RFC 9457 ``application/problem+json`` error handling.

A single ``AppError`` hierarchy keeps error shapes consistent across the API
and prevents internal details (stack traces, SQL) from leaking to clients.
"""

from __future__ import annotations

from typing import Any

from starlette.requests import Request
from starlette.responses import JSONResponse

PROBLEM_CONTENT_TYPE = "application/problem+json"


class AppError(Exception):
    """Base class for expected, client-safe application errors."""

    status_code = 500
    code = "internal_error"
    title = "Internal server error"

    def __init__(self, detail: str | None = None, *, extra: dict[str, Any] | None = None) -> None:
        self.detail = detail or self.title
        self.extra = extra or {}
        super().__init__(self.detail)

    def to_problem(self, request: Request) -> dict[str, Any]:
        problem: dict[str, Any] = {
            "type": f"https://theraviva.local/problems/{self.code}",
            "title": self.title,
            "status": self.status_code,
            "detail": self.detail,
            "instance": str(request.url.path),
        }
        problem.update(self.extra)
        return problem


class ValidationError(AppError):
    status_code = 422
    code = "validation_error"
    title = "Validation failed"

    def __init__(
        self,
        detail: str = "One or more fields are invalid.",
        *,
        errors: list[dict[str, Any]] | None = None,
    ) -> None:
        super().__init__(detail, extra={"errors": errors or []})


class UnauthorizedError(AppError):
    status_code = 401
    code = "unauthorized"
    title = "Authentication required"


class ForbiddenError(AppError):
    status_code = 403
    code = "forbidden"
    title = "Not permitted"


class NotFoundError(AppError):
    status_code = 404
    code = "not_found"
    title = "Not found"


class ConflictError(AppError):
    status_code = 409
    code = "conflict"
    title = "Conflict"


class RateLimitedError(AppError):
    status_code = 429
    code = "rate_limited"
    title = "Too many requests"


class UnavailableError(AppError):
    status_code = 503
    code = "unavailable"
    title = "Service unavailable"


async def app_error_handler(request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, AppError)
    headers: dict[str, str] = {}
    if isinstance(exc, RateLimitedError) and "retry_after" in exc.extra:
        headers["Retry-After"] = str(exc.extra["retry_after"])
    return JSONResponse(
        exc.to_problem(request),
        status_code=exc.status_code,
        media_type=PROBLEM_CONTENT_TYPE,
        headers=headers,
    )


async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    from app.logging import get_logger

    get_logger("app.errors").exception("unhandled error")
    problem = AppError().to_problem(request)
    return JSONResponse(problem, status_code=500, media_type=PROBLEM_CONTENT_TYPE)
