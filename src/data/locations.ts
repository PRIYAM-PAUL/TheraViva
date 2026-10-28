/**
 * Practice locations.
 *
 * TODO(content): the street address is a placeholder. Add the real clinic
 * address, pincode and hours before launch, then verify the Google Business
 * Profile matches exactly (NAP consistency matters for local SEO).
 */

import type { PracticeLocation } from "@/types";

export const locations: PracticeLocation[] = [
  {
    slug: "new-delhi",
    name: "TheraViva — New Delhi",
    city: "New Delhi",
    state: "Delhi",
    addressLines: ["Clinic address to be confirmed"],
    pincode: "110001",
    hours: [
      "Monday – Friday: 9:00 am – 7:00 pm",
      "Saturday: 9:00 am – 5:00 pm",
      "Sunday: By appointment",
    ],
    // Schema.org `openingHours` format. Sunday is by appointment, so it is
    // intentionally omitted here rather than advertised as open.
    openingHoursIso: ["Mo-Fr 09:00-19:00", "Sa 09:00-17:00"],
    phone: "+91 7838696558",
    mapQuery: "New Delhi, India",
    serviceArea: [
      "New Delhi",
      "South Delhi",
      "Central Delhi",
      "Noida",
      "Gurugram",
      "Ghaziabad",
    ],
    primary: true,
  },
];

export function getLocationBySlug(slug: string): PracticeLocation | undefined {
  return locations.find((location) => location.slug === slug);
}

export const primaryLocation =
  locations.find((location) => location.primary) ?? locations[0];
