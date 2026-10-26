/**
 * Content entities: media, portfolio albums, testimonials, case studies,
 * blog posts, FAQs and trust signals.
 */

import type { Discipline } from "./practice";

/** A photo or video asset used across the site. */
export interface MediaAsset {
  id: string;
  kind: "image" | "video";
  /**
   * Image URL or video URL. Leave undefined until a real asset is supplied —
   * the UI renders a branded placeholder instead of a broken image.
   */
  src?: string;
  /** Poster image for videos. */
  poster?: string;
  /** Alt text (required for images, used for accessibility + SEO). */
  alt: string;
  caption?: string;
  discipline?: Discipline;
  /** Related condition slug, if any. */
  condition?: string;
  /** Related professional id, if any. */
  professionalId?: string;
  width?: number;
  height?: number;
  /** Duration in seconds, for videos. */
  durationSeconds?: number;
}

/** A themed collection of media. */
export interface Album {
  slug: string;
  title: string;
  description: string;
  discipline?: Discipline;
  /** Media ids in display order. */
  mediaIds: string[];
}

/** A published client/parent testimonial. */
export interface Testimonial {
  id: string;
  author: string;
  /** e.g. "Parent of a 5-year-old". */
  relation: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  discipline?: Discipline;
  location?: string;
}

/** A consent-gated case study. */
export interface CaseStudy {
  slug: string;
  title: string;
  conditionSlug: string;
  professionalId: string;
  /** Age band only — never identifying details. */
  ageBand: string;
  goals: string[];
  approach: string[];
  outcome: string;
  mediaIds: string[];
}

/** A section within a blog post body. */
export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
}

/** A blog post (static content, no CMS in this phase). */
export interface BlogPost {
  slug: string;
  title: string;
  /** Meta description. */
  description: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  category: string;
  tags: string[];
  /** Author professional id. */
  authorId: string;
  /** Related service/condition slugs. */
  related: string[];
  sections: BlogSection[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** A trust signal shown in the trust bar. */
export interface TrustSignal {
  label: string;
  detail: string;
}

/** A bundled session package. */
export interface PricingPackage {
  id: string;
  name: string;
  /** Number of sessions included. */
  sessions: number;
  /** Total price in whole rupees. */
  amountInr: number;
  description: string;
  featured?: boolean;
}
