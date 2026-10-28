import { describe, expect, it } from "vitest";

import {
  addDays,
  formatDateKey,
  formatDuration,
  formatRupees,
  parseDateKey,
} from "@/lib/format";

describe("formatRupees", () => {
  it("renders a whole-rupee amount without a manual *100", () => {
    const formatted = formatRupees(1200);
    expect(formatted).toContain("1,200");
    expect(formatted).toMatch(/₹/);
  });

  it("renders zero as a currency amount", () => {
    expect(formatRupees(0)).toContain("0");
  });
});

describe("date keys", () => {
  it("round-trips a local date key", () => {
    const date = new Date(2026, 5, 3);
    const key = formatDateKey(date);
    expect(key).toBe("2026-06-03");
    expect(formatDateKey(parseDateKey(key))).toBe(key);
  });

  it("adds days across a month boundary", () => {
    expect(formatDateKey(addDays(new Date(2026, 0, 31), 1))).toBe("2026-02-01");
  });
});

describe("formatDuration", () => {
  it("formats minutes and hours", () => {
    expect(formatDuration(50)).toBe("50 min");
    expect(formatDuration(60)).toBe("1 hr");
    expect(formatDuration(90)).toBe("1 hr 30 min");
  });
});
