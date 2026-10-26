/**
 * Barrel for all shared domain types. Import from `@/types`.
 */

export type { Nullable, Maybe, WithId, Option, Result } from "./common";

export type {
  Discipline,
  AppointmentType,
  Credential,
  ExperienceEntry,
  Registration,
  Professional,
  ServicePrice,
  Service,
  AgeGroup,
  ConditionFaq,
  Condition,
  PracticeLocation,
} from "./practice";

export type {
  MediaAsset,
  Album,
  Testimonial,
  CaseStudy,
  BlogSection,
  BlogPost,
  FaqItem,
  TrustSignal,
  PricingPackage,
} from "./content";

export type {
  AppointmentRequestValues,
  AppointmentFieldErrors,
  TimeWindow,
} from "./appointment";
