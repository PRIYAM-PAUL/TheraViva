/**
 * Client testimonials.
 *
 * Deliberately EMPTY: testimonials are real people's words and must never be
 * invented. Add entries here only once a client has given consent to publish.
 * The UI hides the testimonial section entirely while this list is empty.
 *
 * Example shape (do not invent content — replace with a real, consented review):
 *
 * {
 *   id: "review-1",
 *   author: "Parent of a 5-year-old",
 *   relation: "Occupational therapy",
 *   rating: 5,
 *   body: "…",
 *   discipline: "occupational-therapy",
 *   location: "New Delhi",
 * }
 */

import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [];

/** Average rating across published testimonials, or `null` when none exist. */
export function getAverageRating(): number | null {
  if (testimonials.length === 0) return null;
  const total = testimonials.reduce((sum, item) => sum + item.rating, 0);
  return Math.round((total / testimonials.length) * 10) / 10;
}
