"""Shared response schemas."""

from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import Field

from app.api.schemas.base import APIModel

T = TypeVar("T")


class ProblemOut(APIModel):
    type: str
    title: str
    status: int
    detail: str
    instance: str
    errors: list[dict] | None = None


class PageOut(APIModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int
    has_more: bool = Field(default=False, description="True when more rows exist beyond this page.")
