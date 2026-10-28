"""ASGI application factory.

Run with::

    uvicorn app.main:app --reload

Pure Starlette (no FastAPI): routing, middleware and error handling are wired
explicitly so the request path is easy to follow.
"""

from __future__ import annotations

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.routing import Mount, Route

from app import __version__
from app.api.responses import json_response
from app.api.v1.router import API_V1_PREFIX, build_v1_router
from app.api.v1.routes import health
from app.config import settings
from app.errors import AppError, app_error_handler, unhandled_error_handler
from app.lifespan import lifespan
from app.middleware import (
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)


async def root(request: Request) -> Response:
    return json_response(
        {
            "name": settings.site_name,
            "version": __version__,
            "status": "ok",
            "api": API_V1_PREFIX,
            "docs": f"{API_V1_PREFIX}/openapi.json",
        }
    )


def create_app() -> Starlette:
    routes = [
        Route("/", root, methods=["GET"]),
        Route("/healthz", health.healthz, methods=["GET"]),
        Route("/readyz", health.readyz, methods=["GET"]),
        Route("/version", health.version, methods=["GET"]),
        Route("/metrics", health.metrics, methods=["GET"]),
        Route("/.well-known/security.txt", health.security_txt, methods=["GET"]),
        Route("/.well-known/change-password", health.change_password, methods=["GET", "POST"]),
        Mount(API_V1_PREFIX, app=build_v1_router()),
    ]

    middleware = [
        Middleware(RequestContextMiddleware),
        Middleware(SecurityHeadersMiddleware),
        Middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origin_list,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
            expose_headers=["X-Request-ID"],
        ),
        Middleware(RateLimitMiddleware),
    ]

    return Starlette(
        routes=routes,
        middleware=middleware,
        lifespan=lifespan,
        exception_handlers={
            AppError: app_error_handler,
            Exception: unhandled_error_handler,
        },
    )


app = create_app()


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
