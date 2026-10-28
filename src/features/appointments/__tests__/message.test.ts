import { describe, expect, it } from "vitest";

import { services } from "@/data";
import {
  buildRequestMessage,
  buildRequestSubject,
} from "@/features/appointments/message";
import type { AppointmentRequestValues } from "@/types";

const values: AppointmentRequestValues = {
  mode: "in-person",
  serviceSlug: services[0].slug,
  professionalId: "",
  preferredDate: "",
  preferredTime: "morning",
  fullName: "Test Parent",
  phone: "+91 98765 43210",
  email: "parent@example.com",
  patientName: "Test Child",
  notes: "  Please call in the evening.  ",
  consent: true,
};

describe("buildRequestMessage", () => {
  it("uses the service title and mode label", () => {
    const message = buildRequestMessage(values);
    expect(message).toContain(services[0].title);
    expect(message).toContain("In clinic / home visit");
  });

  it("renders the human time-window label, not the raw value", () => {
    const message = buildRequestMessage(values);
    expect(message).toContain("Morning (9am – 12pm)");
    expect(message).not.toContain("Preferred time: morning");
  });

  it("trims notes and omits the block when empty", () => {
    expect(buildRequestMessage(values)).toContain(
      "Notes: Please call in the evening.",
    );
    expect(buildRequestMessage({ ...values, notes: "   " })).not.toContain(
      "Notes:",
    );
  });

  it("does not throw on a malformed preferred date", () => {
    expect(() =>
      buildRequestMessage({ ...values, preferredDate: "garbage" }),
    ).not.toThrow();
  });

  it("includes a subject naming the service", () => {
    expect(buildRequestSubject(values)).toContain(services[0].title);
  });
});
