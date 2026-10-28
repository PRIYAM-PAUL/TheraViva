"""Engagement and SEO ingestion schemas."""

from __future__ import annotations

from datetime import date

from pydantic import Field

from app.api.schemas.base import APIModel


class EngagementEventIn(APIModel):
    event_type: str = Field(min_length=2, max_length=32)
    path: str | None = Field(default=None, max_length=300)
    session_id: str | None = Field(default=None, max_length=64)
    referrer: str | None = Field(default=None, max_length=500)
    utm_source: str | None = Field(default=None, max_length=120)
    utm_medium: str | None = Field(default=None, max_length=120)
    utm_campaign: str | None = Field(default=None, max_length=120)
    device: str | None = Field(default=None, max_length=32)
    meta: dict = Field(default_factory=dict)


class SeoSnapshotIn(APIModel):
    snapshot_date: date
    page: str = Field(min_length=1, max_length=300)
    impressions: int = Field(default=0, ge=0)
    clicks: int = Field(default=0, ge=0)
    ctr: float = Field(default=0.0, ge=0)
    position: float = Field(default=0.0, ge=0)
    source: str = Field(default="manual", max_length=32)
