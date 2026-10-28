/**
 * Builds the human-readable message a visitor sends to the practice.
 */

import { MODE_LABELS } from "@/config/appointment";
import { getProfessionalById, getServiceBySlug, timeWindows } from "@/data";
import type { AppointmentRequestValues } from "@/types";
import { formatDateLong, parseDateKey } from "@/lib/format";

/** Compose the plain-text request body used for WhatsApp and email. */
export function buildRequestMessage(values: AppointmentRequestValues): string {
  const service = values.serviceSlug ? getServiceBySlug(values.serviceSlug) : undefined;
  const professional = values.professionalId
    ? getProfessionalById(values.professionalId)
    : undefined;

  const lines: string[] = [
    "New appointment request",
    "",
    `Service: ${service?.title ?? "Not specified"}`,
    `Format: ${values.mode ? MODE_LABELS[values.mode] : "Not specified"}`,
    `Preferred clinician: ${professional ? professional.name : "No preference"}`,
  ];

  if (values.preferredDate) {
    const date = parseDateKey(values.preferredDate);
    if (!Number.isNaN(date.getTime())) {
      lines.push(`Preferred date: ${formatDateLong(date)}`);
    }
  }
  if (values.preferredTime) {
    // Store the human label, not the raw option value (e.g. "morning").
    const timeLabel =
      timeWindows.find((window) => window.value === values.preferredTime)
        ?.label ?? values.preferredTime;
    lines.push(`Preferred time: ${timeLabel}`);
  }

  lines.push(
    "",
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email || "Not provided"}`,
    `Appointment for: ${values.patientName}`,
  );

  if (values.notes.trim()) {
    lines.push("", `Notes: ${values.notes.trim()}`);
  }

  lines.push("", "Sent from the TheraViva website.");
  return lines.join("\n");
}

/** Subject line for the email version. */
export function buildRequestSubject(values: AppointmentRequestValues): string {
  const service = values.serviceSlug ? getServiceBySlug(values.serviceSlug) : undefined;
  return `Appointment request — ${service?.title ?? "TheraViva"}`;
}
