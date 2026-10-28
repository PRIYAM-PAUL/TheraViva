"""Indian GST arithmetic for invoices.

Prices are GST-inclusive whole rupees (as shown on the frontend), so tax is
extracted from the total rather than added on top. ``tax_inr`` is rounded to the
nearest rupee; ``subtotal + tax`` always equals the total.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.config import settings


@dataclass(frozen=True)
class TaxBreakdown:
    subtotal_inr: int
    tax_inr: int
    total_inr: int
    rate: float


def breakdown(total_inr: int, rate: float | None = None) -> TaxBreakdown:
    effective_rate = settings.gst_rate if rate is None else rate
    if total_inr < 0:
        raise ValueError("total_inr must be non-negative")
    if effective_rate <= 0:
        return TaxBreakdown(total_inr, 0, total_inr, 0.0)
    subtotal = round(total_inr / (1 + effective_rate))
    tax = total_inr - subtotal
    return TaxBreakdown(subtotal_inr=subtotal, tax_inr=tax, total_inr=total_inr, rate=effective_rate)
