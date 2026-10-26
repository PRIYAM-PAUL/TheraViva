/**
 * Appointment-request validation (zod v4).
 *
 * Client-side only — there is no backend in this phase. Validation exists to
 * help the visitor send a complete request, not as a security boundary.
 */

import { z } from "zod";

import { REQUEST_CONSTRAINTS } from "@/config/appointment";
import type { AppointmentFieldErrors, AppointmentRequestValues } from "@/types";

const PHONE_PATTERN = /^[+()\d\s.-]+$/;

export const requestSchema = z.object({
  mode: z.enum(["video", "in-person", "phone"], {
    error: "Please choose how you would like to meet.",
  }),
  serviceSlug: z.string().min(1, "Please choose a service."),
  professionalId: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
  fullName: z
    .string()
    .trim()
    .min(REQUEST_CONSTRAINTS.fullName.min, "Please enter your name.")
    .max(
      REQUEST_CONSTRAINTS.fullName.max,
      `Please keep this under ${REQUEST_CONSTRAINTS.fullName.max} characters.`,
    ),
  phone: z
    .string()
    .trim()
    .min(REQUEST_CONSTRAINTS.phone.min, "Please enter a phone number.")
    .max(REQUEST_CONSTRAINTS.phone.max, "Please enter a valid phone number.")
    .regex(PHONE_PATTERN, "Please enter a valid phone number."),
  email: z.union([
    z.literal(""),
    z.email("Please enter a valid email address."),
  ]),
  patientName: z
    .string()
    .trim()
    .min(
      REQUEST_CONSTRAINTS.patientName.min,
      "Please tell us who the appointment is for.",
    )
    .max(
      REQUEST_CONSTRAINTS.patientName.max,
      `Please keep this under ${REQUEST_CONSTRAINTS.patientName.max} characters.`,
    ),
  notes: z
    .string()
    .trim()
    .max(
      REQUEST_CONSTRAINTS.notes.max,
      `Please keep this under ${REQUEST_CONSTRAINTS.notes.max} characters.`,
    ),
  consent: z.literal(true, {
    error: "Please confirm you understand before sending.",
  }),
});

export type RequestInput = z.input<typeof requestSchema>;
export type RequestOutput = z.output<typeof requestSchema>;

/** Field errors for a given subset of fields (used to gate each step). */
export function validateRequestFields(
  values: AppointmentRequestValues,
  fields: (keyof AppointmentRequestValues)[],
): AppointmentFieldErrors {
  const result = requestSchema.safeParse(values);
  if (result.success) return {};

  const errors: AppointmentFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (
      typeof key === "string" &&
      (fields as string[]).includes(key) &&
      !(key in errors)
    ) {
      errors[key as keyof AppointmentFieldErrors] = issue.message;
    }
  }
  return errors;
}

/** Validate the whole request. */
export function validateRequest(values: AppointmentRequestValues): {
  success: boolean;
  errors: AppointmentFieldErrors;
} {
  const result = requestSchema.safeParse(values);
  if (result.success) return { success: true, errors: {} };

  const errors: AppointmentFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof AppointmentFieldErrors] = issue.message;
    }
  }
  return { success: false, errors };
}
