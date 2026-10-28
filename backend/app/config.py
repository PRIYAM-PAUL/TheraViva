"""Typed application settings, loaded from the environment.

Uses ``pydantic-settings`` so every value is validated at startup and a missing
or malformed variable fails fast rather than surfacing at request time.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="THERAVIVA_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Core --------------------------------------------------------------
    env: str = "development"
    debug: bool = False
    site_name: str = "TheraViva"
    frontend_url: str = "http://localhost:3000"
    database_url: str = "sqlite+aiosqlite:///./var/theraviva.db"
    auto_create_tables: bool = True

    # --- Security ----------------------------------------------------------
    secret_key: str = "dev-insecure-secret-change-me-in-production-0000000000"
    access_token_minutes: int = 30
    refresh_token_days: int = 30
    cors_origins: str = "http://localhost:3000"

    admin_email: str = "admin@theraviva.local"
    admin_password: str = "admin12345"
    admin_name: str = "TheraViva Admin"

    # --- OTP ---------------------------------------------------------------
    otp_dev_code: str = "123456"
    otp_ttl_minutes: int = 10
    otp_max_attempts: int = 5

    # --- Storage -----------------------------------------------------------
    storage_dir: str = "./var/storage"

    # --- Providers ---------------------------------------------------------
    payment_provider: str = "manual"
    email_provider: str = "fake"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    email_from: str = "TheraViva <no-reply@theraviva.local>"

    messaging_provider: str = "fake"
    waha_base_url: str = "http://localhost:3000"
    waha_api_key: str = ""
    waha_session: str = "default"

    sms_provider: str = "console"

    # --- Business ----------------------------------------------------------
    gst_rate: float = 0.18
    rate_limit_per_minute: int = 120

    # --- Derived -----------------------------------------------------------
    @property
    def is_production(self) -> bool:
        return self.env.lower() in {"production", "prod"}

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @field_validator("gst_rate")
    @classmethod
    def _validate_gst(cls, value: float) -> float:
        if not 0 <= value < 1:
            raise ValueError("gst_rate must be a fraction between 0 and 1 (e.g. 0.18)")
        return value


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor (one instance per process)."""
    return Settings()


settings = get_settings()
