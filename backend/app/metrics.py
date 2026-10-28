"""Prometheus metrics registry.

Exposed at ``/metrics`` in the Prometheus text exposition format.
"""

from __future__ import annotations

from prometheus_client import (
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

REGISTRY = CollectorRegistry()

HTTP_REQUESTS = Counter(
    "theraviva_http_requests_total",
    "Total HTTP requests.",
    ["method", "path", "status"],
    registry=REGISTRY,
)
HTTP_LATENCY = Histogram(
    "theraviva_http_request_duration_seconds",
    "HTTP request latency in seconds.",
    ["method", "path"],
    registry=REGISTRY,
)
APPOINTMENTS_CREATED = Counter(
    "theraviva_appointments_created_total",
    "Appointments created, by status.",
    ["status"],
    registry=REGISTRY,
)
INTAKE_SUBMITTED = Counter(
    "theraviva_intake_submitted_total",
    "Intake submissions, by kind.",
    ["kind"],
    registry=REGISTRY,
)
READY = Gauge(
    "theraviva_ready",
    "1 when the service is ready to serve traffic.",
    registry=REGISTRY,
)


def render() -> bytes:
    return generate_latest(REGISTRY)


def content_type() -> str:
    return CONTENT_TYPE_LATEST
