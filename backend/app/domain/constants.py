"""Domain constants mirrored from the frontend.

These intentionally duplicate ``src/config/appointment.ts`` and
``src/data/pricing.ts`` so the backend enforces exactly the same rules the
client does. They are the single place to update if the frontend changes.
"""

from __future__ import annotations

APPOINTMENT_MODES = ("in-person", "video", "phone")

MODE_LABELS = {
    "in-person": "In clinic / home visit",
    "video": "Online video",
    "phone": "Phone / WhatsApp",
}

#: Preferred time windows offered by the request form.
TIME_WINDOWS = (
    ("morning", "Morning (9am – 12pm)"),
    ("afternoon", "Afternoon (12pm – 4pm)"),
    ("evening", "Evening (4pm – 7pm)"),
    ("flexible", "I'm flexible"),
)
TIME_WINDOW_VALUES = tuple(value for value, _ in TIME_WINDOWS)

#: How many days ahead a preferred date may be chosen.
PREFERRED_DATE_HORIZON_DAYS = 90

#: Field constraints, mirroring ``REQUEST_CONSTRAINTS`` on the frontend.
REQUEST_CONSTRAINTS = {
    "fullName": {"min": 2, "max": 80},
    "phone": {"min": 7, "max": 20},
    "email": {"max": 254},
    "patientName": {"min": 2, "max": 80},
    "notes": {"max": 600},
}
