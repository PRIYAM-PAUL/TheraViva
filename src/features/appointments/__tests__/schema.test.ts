import { describe, expect, it } from "vitest";

import { professionals, services } from "@/data";
import { validateRequest } from "@/features/appointments/schema";
import { addDays, formatDateKey } from "@/lib/format";
import type { AppointmentRequestValues } from "@/types";

const base: AppointmentRequestValues = {
  mode: "in-person",
  serviceSlug: services[0].slug,
  professionalId: "",
  preferredDate: "",
  preferredTime: "",
  fullName: "Test Parent",
  phone: "+91 98765 43210",
  email: "",
  patientName: "Test Child",
  notes: "",
  consent: true,
};

const valid = (overrides: Partial<AppointmentRequestValues> = {}) => ({
  ...base,
  ...overrides,
});

describe("appointment request validation", () => {
  it("accepts a complete, well-formed request", () => {
    expect(validateRequest(valid())).toEqual({ success: true, errors: {} });
  });

  it("requires a known service", () => {
    const result = validateRequest(valid({ serviceSlug: "not-a-service" }));
    expect(result.success).toBe(false);
    expect(result.errors.serviceSlug).toBeDefined();
  });

  it("rejects an unknown professional id", () => {
    const result = validateRequest(valid({ professionalId: "ghost" }));
    expect(result.success).toBe(false);
    expect(result.errors.professionalId).toBeDefined();
  });

  it("accepts a listed professional id", () => {
    const result = validateRequest(
      valid({ professionalId: professionals[0].id }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a malformed preferred date", () => {
    const result = validateRequest(valid({ preferredDate: "not-a-date" }));
    expect(result.success).toBe(false);
    expect(result.errors.preferredDate).toBeDefined();
  });

  it("rejects a preferred date beyond the booking horizon", () => {
    const tooFar = formatDateKey(addDays(new Date(), 200));
    const result = validateRequest(valid({ preferredDate: tooFar }));
    expect(result.success).toBe(false);
    expect(result.errors.preferredDate).toBeDefined();
  });

  it("accepts a preferred date within the horizon", () => {
    const soon = formatDateKey(addDays(new Date(), 3));
    expect(validateRequest(valid({ preferredDate: soon })).success).toBe(true);
  });

  it("only accepts known time windows", () => {
    expect(validateRequest(valid({ preferredTime: "morning" })).success).toBe(
      true,
    );
    const bad = validateRequest(valid({ preferredTime: "midnight" }));
    expect(bad.success).toBe(false);
    expect(bad.errors.preferredTime).toBeDefined();
  });

  it("rejects a phone number without enough digits", () => {
    const result = validateRequest(valid({ phone: "......." }));
    expect(result.success).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });

  it("enforces the email maximum length", () => {
    const long = `${"a".repeat(250)}@example.com`;
    const result = validateRequest(valid({ email: long }));
    expect(result.success).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("accepts a blank or a valid email", () => {
    expect(validateRequest(valid({ email: "" })).success).toBe(true);
    expect(validateRequest(valid({ email: "a@b.com" })).success).toBe(true);
  });

  it("requires explicit consent", () => {
    const result = validateRequest(valid({ consent: false }));
    expect(result.success).toBe(false);
    expect(result.errors.consent).toBeDefined();
  });
});
