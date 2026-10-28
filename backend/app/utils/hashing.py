"""Hashing helpers for privacy-preserving identifiers."""

from __future__ import annotations

import hashlib

from app.config import settings


def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def hash_ip(ip: str | None) -> str | None:
    """Salted, one-way hash of a client IP address.

    The raw IP is never stored or logged; the hash lets us detect abuse and
    de-duplicate events without retaining personally identifiable data.
    """
    if not ip:
        return None
    return hashlib.sha256(f"{settings.secret_key}:{ip}".encode()).hexdigest()
