/**
 * Appointment-request configuration: flow steps, mode labels and constraints.
 *
 * There is no scheduling backend in this phase, so the "steps" describe a
 * request the visitor composes and sends to the practice.
 */

import type { AppointmentType, Option } from "@/types";

export interface RequestStep {
  id: "need" | "schedule" | "details";
  label: string;
  description: string;
}

export const REQUEST_STEPS: RequestStep[] = [
  {
    id: "need",
    label: "What you need",
    description: "Choose a service and how you'd like to meet.",
  },
  {
    id: "schedule",
    label: "Preferred time",
    description: "Tell us when suits you best.",
  },
  {
    id: "details",
    label: "Your details",
    description: "So the practice can get back to you.",
  },
];

export const MODE_LABELS: Record<AppointmentType, string> = {
  "in-person": "In clinic / home visit",
  video: "Online video",
  phone: "Phone / WhatsApp",
};

export const MODE_DESCRIPTIONS: Record<AppointmentType, string> = {
  "in-person": "Hands-on assessment or therapy at the clinic, or a home visit.",
  video: "A secure video session, with a parent present for younger children.",
  phone: "A short review, coaching or follow-up call.",
};

export const MODE_OPTIONS: Option<AppointmentType>[] = (
  Object.keys(MODE_LABELS) as AppointmentType[]
).map((value) => ({ value, label: MODE_LABELS[value] }));

export const REQUEST_CONSTRAINTS = {
  fullName: { min: 2, max: 80 },
  phone: { min: 7, max: 20 },
  email: { max: 254 },
  patientName: { min: 2, max: 80 },
  notes: { max: 600 },
} as const;

/** How many days ahead a preferred date can be chosen. */
export const PREFERRED_DATE_HORIZON_DAYS = 90;
