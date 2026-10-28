"""Base API model: camelCase aliases so the Next.js frontend can send and read
its own domain objects unchanged (e.g. ``serviceSlug``, ``preferredDate``)."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(word.capitalize() for word in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
        extra="forbid",
        str_strip_whitespace=True,
    )
