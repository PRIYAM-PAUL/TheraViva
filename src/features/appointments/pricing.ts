import { formatRupees } from "@/lib/format";
import type { AppointmentType, Service } from "@/types";

/** Lowest price for a service in a given mode (or overall). */
export function priceForMode(
  service: Service,
  mode: AppointmentType | null,
): number | null {
  if (mode) {
    const match = service.prices.find((price) => price.mode === mode);
    if (match) return match.amountInr;
  }
  if (service.prices.length === 0) return null;
  return Math.min(...service.prices.map((price) => price.amountInr));
}

/** Human-readable price label. `prices` are whole rupees. */
export function formatServicePrice(
  service: Service,
  mode: AppointmentType | null = null,
): string {
  const amount = priceForMode(service, mode);
  if (amount === null) return "Price on request";
  if (amount === 0) return "No charge";
  const formatted = formatRupees(amount);
  return mode ? formatted : `from ${formatted}`;
}
