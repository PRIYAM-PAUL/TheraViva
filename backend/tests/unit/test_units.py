"""Unit tests for GST arithmetic, security primitives and validation helpers."""

from __future__ import annotations

from datetime import date, timedelta

import pytest
from pydantic import ValidationError as PydanticValidationError

from app.api.schemas.intake import AppointmentRequestIn
from app.utils.gst import breakdown
from app.utils.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    new_reference,
    token_hash,
    verify_password,
)


def test_gst_breakdown_is_inclusive_and_exact():
    result = breakdown(1180, rate=0.18)
    assert result.subtotal_inr == 1000
    assert result.tax_inr == 180
    assert result.subtotal_inr + result.tax_inr == result.total_inr


def test_gst_zero_rate():
    result = breakdown(500, rate=0.0)
    assert result.tax_inr == 0
    assert result.subtotal_inr == 500


def test_gst_rejects_negative():
    with pytest.raises(ValueError):
        breakdown(-1)


def test_password_hash_round_trip():
    hashed = hash_password("correct horse battery staple")
    assert verify_password("correct horse battery staple", hashed)
    assert not verify_password("wrong", hashed)
    assert not verify_password("anything", None)


def test_jwt_round_trip():
    token = create_access_token("user-1", "patient")
    payload = decode_access_token(token)
    assert payload["sub"] == "user-1"
    assert payload["role"] == "patient"


def test_token_hash_is_deterministic_and_salted():
    assert token_hash("abc") == token_hash("abc")
    assert token_hash("abc") != token_hash("abd")


def test_reference_format():
    reference = new_reference()
    assert reference.startswith("TV-")
    assert len(reference) == 9


def _payload(**overrides) -> dict:
    base = {
        "mode": "video",
        "service_slug": "occupational-therapy-assessment",
        "professional_id": "md-irfan",
        "preferred_date": "",
        "preferred_time": "morning",
        "full_name": "Test Parent",
        "phone": "9876543210",
        "email": "parent@example.com",
        "patient_name": "Test Child",
        "notes": "",
        "consent": True,
    }
    base.update(overrides)
    return base


def test_appointment_schema_accepts_valid_payload():
    model = AppointmentRequestIn.model_validate(_payload())
    assert model.service_slug == "occupational-therapy-assessment"


def test_appointment_schema_requires_consent():
    with pytest.raises(PydanticValidationError):
        AppointmentRequestIn.model_validate(_payload(consent=False))


def test_appointment_schema_rejects_invalid_mode():
    with pytest.raises(PydanticValidationError):
        AppointmentRequestIn.model_validate(_payload(mode="telepathy"))


def test_appointment_schema_rejects_bad_phone():
    with pytest.raises(PydanticValidationError):
        AppointmentRequestIn.model_validate(_payload(phone="abc"))


def test_appointment_schema_accepts_future_date_within_horizon():
    future = (date.today() + timedelta(days=30)).isoformat()
    model = AppointmentRequestIn.model_validate(_payload(preferred_date=future))
    assert model.preferred_date == future


def test_appointment_schema_rejects_past_date():
    with pytest.raises(PydanticValidationError):
        AppointmentRequestIn.model_validate(_payload(preferred_date="2000-01-01"))


def test_appointment_schema_accepts_empty_optional_fields():
    model = AppointmentRequestIn.model_validate(
        _payload(professional_id="", preferred_time="", email="", notes="")
    )
    assert model.professional_id == ""
    assert model.email == ""
