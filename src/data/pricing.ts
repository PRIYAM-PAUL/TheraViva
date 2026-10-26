/**
 * Pricing content.
 *
 * TODO(pricing): confirm the real price list with the practice. Session prices
 * live on each `Service` in `@/data/services`; the packages below are the only
 * invented numbers and are marked as indicative.
 */

import type { PricingPackage, TimeWindow } from "@/types";

/** Reassurance points shown alongside pricing. */
export const pricingNotes: { title: string; description: string }[] = [
  {
    title: "Clear pricing before you book",
    description:
      "Session fees are shown up front. The practice confirms the final amount when your appointment is scheduled.",
  },
  {
    title: "No charge for the first enquiry",
    description:
      "Sending a request and discussing whether therapy is right for you costs nothing.",
  },
  {
    title: "Online and in-clinic",
    description:
      "Online sessions are priced the same as in-clinic sessions unless stated otherwise.",
  },
  {
    title: "Assessment includes a summary",
    description:
      "Assessments include a plain-language summary and home recommendations.",
  },
];

/** TODO(pricing): indicative session bundles — replace with the real offer. */
export const packages: PricingPackage[] = [
  {
    id: "starter-block",
    name: "Starter block",
    sessions: 6,
    amountInr: 5100,
    description:
      "Six therapy sessions for families starting a programme, with a review at the end.",
  },
  {
    id: "therapy-block",
    name: "Therapy block",
    sessions: 12,
    amountInr: 9600,
    description:
      "Twelve sessions with ongoing progress reviews — the most common therapy plan.",
    featured: true,
  },
  {
    id: "assessment-plus-review",
    name: "Assessment + review",
    sessions: 2,
    amountInr: 1600,
    description:
      "A full assessment followed by a review session to check the plan is working.",
  },
];

/** Preferred time windows offered in the request form. */
export const timeWindows: TimeWindow[] = [
  { value: "morning", label: "Morning (9am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 4pm)" },
  { value: "evening", label: "Evening (4pm – 7pm)" },
  { value: "flexible", label: "I'm flexible" },
];

export const pricingDisclaimer =
  "Prices shown are indicative and confirmed by the practice when your appointment is scheduled. This site does not take payments.";
