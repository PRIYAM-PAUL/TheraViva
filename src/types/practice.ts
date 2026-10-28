/**
 * Practice domain entities: the people, the services they offer, and the
 * conditions they treat.
 *
 * This is the canonical model for the public site. There is no backend in this
 * phase, so all of this is authored content (see `@/data`).
 */

/** Clinical disciplines offered by the practice. */
export type Discipline = "occupational-therapy" | "speech-language" | "audiology";

/** How a session can be delivered. */
export type AppointmentType = "video" | "in-person" | "phone";

/** A credential/qualification. */
export interface Credential {
  title: string;
  /** Institution, if specified. */
  institution?: string;
  /** Free-form period, e.g. "2024 – 2026". */
  period: string;
}

/** A role held by a professional. */
export interface ExperienceEntry {
  role: string;
  organisation: string;
  period: string;
  location?: string;
  points: string[];
  /** `true` for volunteer/unpaid roles. */
  volunteer?: boolean;
}

/** A regulatory/professional registration shown as a trust signal. */
export interface Registration {
  label: string;
  /** Registration number. Replace placeholders with verified values. */
  value: string;
}

/** A clinician in the practice. */
export interface Professional {
  id: string;
  /** URL slug, e.g. "md-irfan". */
  slug: string;
  name: string;
  /** Short role line, e.g. "Occupational Therapist · Paediatrics". */
  headline: string;
  /** One-line summary for cards. */
  summary: string;
  /** Bio paragraphs. */
  bio: string[];
  disciplines: Discipline[];
  /** Condition slugs this professional treats. */
  conditions: string[];
  skills: string[];
  languages: string[];
  yearsExperience: number;
  credentials: Credential[];
  registrations: Registration[];
  experience: ExperienceEntry[];
  volunteering: ExperienceEntry[];
  /** Public contact details for this professional. */
  email: string;
  phone: string;
  /** Optional media. Paths are placeholders until real assets are supplied. */
  photo?: string;
  heroVideo?: string;
  /** Path to a short-form intro video, if available. */
  introVideo?: string;
}

/** Indicative price for one delivery mode. */
export interface ServicePrice {
  mode: AppointmentType;
  /** Price in whole rupees (INR). */
  amountInr: number;
}

/** A bookable service. */
export interface Service {
  id: string;
  slug: string;
  discipline: Discipline;
  title: string;
  /** One-line summary for cards. */
  summary: string;
  /** Longer description paragraphs. */
  description: string[];
  durationMinutes: number;
  /** Delivery modes this service supports. */
  modes: AppointmentType[];
  /** Condition slugs this service addresses. */
  conditions: string[];
  /** Professional ids who can deliver this service. */
  professionalIds: string[];
  /** Indicative pricing per mode. */
  prices: ServicePrice[];
  /** Shown beside pricing, e.g. "includes home programme". */
  priceNote?: string;
  /** Highlight on listing pages. */
  featured?: boolean;
}

/** Age group a condition page targets. */
export type AgeGroup = "child" | "adult" | "all";

export interface ConditionFaq {
  question: string;
  answer: string;
}

/** A condition/support page (SEO landing page). */
export interface Condition {
  slug: string;
  title: string;
  /** Short label for chips/links. */
  shortTitle: string;
  /** Disciplines that treat this condition. */
  disciplines: Discipline[];
  ageGroup: AgeGroup;
  /** Meta description / intro line. */
  summary: string;
  /** Body paragraphs. */
  body: string[];
  /** "Signs to look out for" bullets. */
  signs: string[];
  /** How the practice helps. */
  approach: string[];
  faq: ConditionFaq[];
  /** Related service slugs. */
  services: string[];
  /** Professional ids who treat this condition. */
  professionalIds: string[];
}

/** A physical practice location. */
export interface PracticeLocation {
  slug: string;
  name: string;
  city: string;
  state: string;
  addressLines: string[];
  pincode: string;
  /** Human-readable opening hours, shown in the UI. */
  hours: string[];
  /** Machine-readable hours for structured data, e.g. "Mo-Fr 09:00-19:00". */
  openingHoursIso: string[];
  phone: string;
  /** Free-text map query for an embed/directions link. */
  mapQuery: string;
  /** Areas served (for local SEO copy). */
  serviceArea: string[];
  /** `true` for the primary clinic. */
  primary?: boolean;
}
