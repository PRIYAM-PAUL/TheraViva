"""Seed weekly availability rules so the booking flow has real slots.

Without these rows ``GET /availability`` returns an empty list. The schedule
below is a sensible default for the two clinicians in ``src/data/professionals.ts``
(``md-irfan``, ``abhishek-kumar``); edit it to match the practice's real hours.

Idempotent: a professional + mode pair is only seeded when it has no rules yet.
"""

from __future__ import annotations

import uuid
from datetime import time

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import AvailabilityRule

#: The practice's clinicians (mirror of the frontend professional ids).
PROFESSIONALS = ("md-irfan", "abhishek-kumar")

#: (weekday, start, end) windows. weekday: 0 = Monday … 6 = Sunday.
WEEKDAY_WINDOW = (time(9, 0), time(18, 0))
SATURDAY_WINDOW = (time(9, 0), time(14, 0))

#: Which delivery modes get rules, and the slot length for each.
MODE_SLOT_MINUTES = {
    "in-person": 45,
    "video": 45,
    "phone": 30,
}


async def seed_availability(session: AsyncSession, *, force: bool = False) -> int:
    created = 0
    for professional_id in PROFESSIONALS:
        for mode, slot_minutes in MODE_SLOT_MINUTES.items():
            existing = int(
                await session.scalar(
                    select(func.count())
                    .select_from(AvailabilityRule)
                    .where(
                        AvailabilityRule.professional_id == professional_id,
                        AvailabilityRule.mode == mode,
                    )
                )
                or 0
            )
            if existing and not force:
                continue
            windows: list[tuple[int, time, time]] = []
            for weekday in range(0, 5):  # Mon–Fri
                windows.append((weekday, *WEEKDAY_WINDOW))
            windows.append((5, *SATURDAY_WINDOW))  # Sat
            for weekday, start, end in windows:
                session.add(
                    AvailabilityRule(
                        id=str(uuid.uuid4()),
                        professional_id=professional_id,
                        mode=mode,
                        weekday=weekday,
                        start_time=start,
                        end_time=end,
                        slot_minutes=slot_minutes,
                    )
                )
                created += 1
    await session.commit()
    return created
