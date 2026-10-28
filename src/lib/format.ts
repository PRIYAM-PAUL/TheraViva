/**
 * Locale-aware, timezone-safe formatting helpers.
 *
 * Design notes:
 *  - Calendar-day helpers use *local* date components and never round-trip
 *    through `toISOString()`, which would shift the day across UTC boundaries.
 *  - `YYYY-MM-DD` keys are parsed by explicit component split, not by
 *    `new Date(key)`, which the spec interprets as UTC midnight.
 *  - Formatters are pure so they can be used during SSR and on the client.
 */

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/config/site";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Format minor units (e.g. cents) as a localized currency string. */
export function formatCurrency(
  amountInMinorUnits: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountInMinorUnits / 100);
}

/**
 * Format a whole-rupee amount.
 *
 * Domain prices are stored as whole rupees (`amountInr`), whereas
 * `formatCurrency` expects minor units. This wrapper keeps the `* 100`
 * conversion in one place so a call site can't silently render 1/100th.
 */
export function formatRupees(
  amountInr: number,
  locale: string = DEFAULT_LOCALE,
): string {
  return formatCurrency(Math.round(amountInr * 100), DEFAULT_CURRENCY, locale);
}

/** Local `YYYY-MM-DD` key for a date. */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse a local `YYYY-MM-DD` key into a Date at local midnight. */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** e.g. "Monday, June 3, 2026". */
export function formatDateLong(
  date: Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** e.g. "Mon, Jun 3". */
export function formatDateShort(
  date: Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

/** e.g. "June 2026". */
export function formatMonthYear(
  date: Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Single-letter weekday labels for a calendar header, in display order. */
export function getWeekdayLabels(
  locale: string = DEFAULT_LOCALE,
  weekStartsOn = 0,
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 2024-01-07 is a Sunday — a stable reference week.
  const sunday = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
}

/** e.g. "9:30 AM". */
export function formatTime(
  date: Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** e.g. "9:30 AM – 10:30 AM". */
export function formatTimeRange(
  start: Date,
  end: Date,
  locale: string = DEFAULT_LOCALE,
): string {
  return `${formatTime(start, locale)} – ${formatTime(end, locale)}`;
}

/** e.g. "50 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

/** Add (or subtract, with a negative value) whole days. */
export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Add (or subtract) whole months, clamping the day to the target month. */
export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(
    next.getFullYear(),
    next.getMonth() + 1,
    0,
  ).getDate();
  next.setDate(Math.min(date.getDate(), lastDay));
  return next;
}

/** First day of the month at local midnight. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Last day of the month at local midnight. */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Local midnight for the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** True when both dates fall on the same local calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** True when both dates fall in the same month and year. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Whole-day difference (b − a) ignoring time-of-day. */
export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY);
}

/**
 * A 6×7 calendar grid (42 cells) for the month containing `month`,
 * padded with leading/trailing days so the grid is always complete.
 */
export function getMonthMatrix(month: Date, weekStartsOn = 0): Date[] {
  const first = startOfMonth(month);
  const leading = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -leading);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}
