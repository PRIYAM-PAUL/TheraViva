/**
 * Appointment-request types.
 *
 * This phase has no backend, so an "appointment" is a *request* the visitor
 * composes and sends to the practice via WhatsApp or email. Nothing is stored
 * or persisted here.
 */

import type { AppointmentType } from "./practice";

/** Values collected by the request-an-appointment form. */
export interface AppointmentRequestValues {
  mode: AppointmentType | null;
  /** Service slug, or "" when not chosen. */
  serviceSlug: string;
  /** Professional id, or "" for "no preference". */
  professionalId: string;
  /** Preferred date key (`YYYY-MM-DD`), or "". */
  preferredDate: string;
  /** Preferred time window label, or "". */
  preferredTime: string;
  fullName: string;
  phone: string;
  email: string;
  patientName: string;
  notes: string;
  consent: boolean;
}

export type AppointmentFieldErrors = Partial<
  Record<keyof AppointmentRequestValues, string>
>;

/** Preferred time windows offered in the request form. */
export interface TimeWindow {
  value: string;
  label: string;
}
