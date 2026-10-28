"""Intake schemas — mirror ``src/features/appointments/schema.ts`` exactly."""

from __future__ import annotations

import re
from datetime import date, timedelta

from pydantic import Field, field_validator, model_validator

from app.api.schemas.base import APIModel
from app.domain.constants import (
    APPOINTMENT_MODES,
    PREFERRED_DATE_HORIZON_DAYS,
    REQUEST_CONSTRAINTS,
    TIME_WINDOW_VALUES,
)

PHONE_PATTERN = re.compile(r"^[+()\d\s.-]+$")
_ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
MIN_PHONE_DIGITS = REQUEST_CONSTRAINTS["phone"]["min"]


def _validate_phone(value: str) -> str:
    if not PHONE_PATTERN.match(value):
        raise ValueError("Please enter a valid phone number.")
    if len(value) < REQUEST_CONSTRAINTS["phone"]["min"]:
        raise ValueError("Please enter a phone number.")
    if len(value) > REQUEST_CONSTRAINTS["phone"]["max"]:
        raise ValueError("Please enter a valid phone number.")
    if len(re.findall(r"\d", value)) < MIN_PHONE_DIGITS:
        raise ValueError("Please enter a valid phone number.")
    return value


def _validate_optional_email(value: str | None) -> str | None:
    if not value:
        return None
    if "@" not in value or value.startswith("@") or value.endswith("@"):
        raise ValueError("Please enter a valid email address.")
    if len(value) > REQUEST_CONSTRAINTS["email"]["max"]:
        raise ValueError("Please enter a valid email address.")
    return value


class AppointmentRequestIn(APIModel):
    mode: str
    service_slug: str = Field(min_length=1)
    professional_id: str = ""
    preferred_date: str = ""
    preferred_time: str = ""
    full_name: str
    phone: str
    email: str = ""
    patient_name: str
    notes: str = ""
    consent: bool = False
    source: str | None = None

    @field_validator("mode")
    @classmethod
    def _mode(cls, value: str) -> str:
        if value not in APPOINTMENT_MODES:
            raise ValueError("Please choose how you would like to meet.")
        return value

    @field_validator("full_name")
    @classmethod
    def _full_name(cls, value: str) -> str:
        return _bounded(value, "fullName", "Please enter your name.")

    @field_validator("patient_name")
    @classmethod
    def _patient_name(cls, value: str) -> str:
        return _bounded(value, "patientName", "Please tell us who the appointment is for.")

    @field_validator("phone")
    @classmethod
    def _phone(cls, value: str) -> str:
        return _validate_phone(value)

    @field_validator("email")
    @classmethod
    def _email(cls, value: str) -> str:
        return _validate_optional_email(value) or ""

    @field_validator("notes")
    @classmethod
    def _notes(cls, value: str) -> str:
        if len(value) > REQUEST_CONSTRAINTS["notes"]["max"]:
            raise ValueError(
                f"Please keep this under {REQUEST_CONSTRAINTS['notes']['max']} characters."
            )
        return value

    @field_validator("preferred_time")
    @classmethod
    def _time(cls, value: str) -> str:
        if value and value not in TIME_WINDOW_VALUES:
            raise ValueError("Please choose a valid time window.")
        return value

    @field_validator("preferred_date")
    @classmethod
    def _date(cls, value: str) -> str:
        if not value:
            return ""
        if not _ISO_DATE.match(value):
            raise ValueError("Choose a valid date.")
        try:
            parsed = date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError("Choose a valid date.") from exc
        today = date.today()
        latest = today + timedelta(days=PREFERRED_DATE_HORIZON_DAYS)
        if parsed < today or parsed > latest:
            raise ValueError(
                f"Choose a date within the next {PREFERRED_DATE_HORIZON_DAYS} days."
            )
        return value

    @model_validator(mode="after")
    def _consent(self) -> AppointmentRequestIn:
        if self.consent is not True:
            raise ValueError("Please confirm you understand before sending.")
        return self


class EnquiryIn(APIModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = ""
    phone: str = ""
    subject: str | None = Field(default=None, max_length=160)
    message: str = Field(min_length=5, max_length=2000)
    consent: bool = False

    @field_validator("email")
    @classmethod
    def _email(cls, value: str) -> str:
        return _validate_optional_email(value) or ""

    @field_validator("phone")
    @classmethod
    def _phone(cls, value: str) -> str:
        if value:
            return _validate_phone(value)
        return value

    @model_validator(mode="after")
    def _contact_required(self) -> EnquiryIn:
        if not self.email and not self.phone:
            raise ValueError("Please provide an email address or a phone number.")
        return self


class ReferralIn(APIModel):
    referrer_name: str = Field(min_length=2, max_length=120)
    referrer_role: str | None = Field(default=None, max_length=120)
    referrer_org: str | None = Field(default=None, max_length=160)
    referrer_contact: str | None = Field(default=None, max_length=160)
    client_name: str = Field(min_length=2, max_length=120)
    client_age: str | None = Field(default=None, max_length=24)
    concerns: str = Field(min_length=5, max_length=2000)
    history: str | None = Field(default=None, max_length=2000)
    preferred_format: str | None = Field(default=None, max_length=48)
    consent: bool = False

    @model_validator(mode="after")
    def _consent(self) -> ReferralIn:
        if self.consent is not True:
            raise ValueError("Please confirm you have consent to share these details.")
        return self


class IntakeOut(APIModel):
    id: str
    reference: str
    status: str
    kind: str


class IntakeStatusUpdate(APIModel):
    status: str


def _bounded(value: str, field: str, message: str) -> str:
    limits = REQUEST_CONSTRAINTS[field]
    if len(value) < limits["min"]:
        raise ValueError(message)
    if len(value) > limits["max"]:
        raise ValueError(f"Please keep this under {limits['max']} characters.")
    return value
