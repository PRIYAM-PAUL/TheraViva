"""Analytics for the dashboards: engagement events and SEO snapshots.

Engagement events are privacy-respecting: no cookies for tracking, no PHI, and
the IP is stored only as a salted hash. SEO snapshots are recorded manually or
imported (e.g. from Google Search Console) since no external API is assumed.
"""

from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.domain.models.base import Base, UTCDateTime

ENGAGEMENT_EVENT_TYPES = (
    "page_view",
    "cta_click",
    "whatsapp_click",
    "phone_click",
    "email_click",
    "booking_started",
    "booking_submitted",
    "contact_submitted",
    "referral_submitted",
)


class EngagementEvent(Base):
    __tablename__ = "engagement_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    event_type: Mapped[str] = mapped_column(String(32), index=True)
    path: Mapped[str | None] = mapped_column(String(300), nullable=True, index=True)
    session_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    user_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    referrer: Mapped[str | None] = mapped_column(String(500), nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(120), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(120), nullable=True)
    device: Mapped[str | None] = mapped_column(String(32), nullable=True)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(UTCDateTime, index=True)


class SeoSnapshot(Base):
    __tablename__ = "seo_snapshots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    page: Mapped[str] = mapped_column(String(300), index=True)
    impressions: Mapped[int] = mapped_column(Integer, default=0)
    clicks: Mapped[int] = mapped_column(Integer, default=0)
    ctr: Mapped[float] = mapped_column(Float, default=0.0)
    position: Mapped[float] = mapped_column(Float, default=0.0)
    source: Mapped[str] = mapped_column(String(32), default="manual")
    created_at: Mapped[datetime] = mapped_column(UTCDateTime)
