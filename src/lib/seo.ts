/**
 * SEO helpers: canonical URLs, page metadata, and JSON-LD structured data.
 *
 * Structured data is generated from the same authored content the pages render,
 * so it can never drift from what a visitor sees.
 */

import type { Metadata } from "next";

import { siteConfig } from "@/config";
import { primaryLocation } from "@/data/locations";
import { professionals } from "@/data/professionals";
import type { BlogPost, Condition, FaqItem, Professional, Service } from "@/types";

/** A JSON-LD document. */
export type JsonLd = Record<string, unknown>;

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix === "/" ? "" : suffix}`;
}

export interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Site-relative path, used for the canonical URL. */
  path: string;
  type?: "website" | "article";
  /** Absolute or site-relative image URL. */
  image?: string;
  /** Exclude from search engines (e.g. thank-you pages). */
  noIndex?: boolean;
  publishedTime?: string;
  keywords?: string[];
}

/** Build Next.js metadata with canonical + Open Graph + Twitter defaults. */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  noIndex,
  publishedTime,
  keywords,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

// ---------------------------------------------------------------- JSON-LD --

/** The practice as an organization. */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    medicalSpecialty: ["OccupationalTherapy", "SpeechPathology", "Audiology"],
    address: {
      "@type": "PostalAddress",
      streetAddress: primaryLocation.addressLines.join(", "),
      addressLocality: primaryLocation.city,
      addressRegion: primaryLocation.state,
      postalCode: primaryLocation.pincode,
      addressCountry: "IN",
    },
    areaServed: primaryLocation.serviceArea.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    openingHours: primaryLocation.hours,
  };
}

/** The website itself. */
export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
  };
}

/** A clinician (Physician). */
export function physicianJsonLd(professional: Professional): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": absoluteUrl(`/team/${professional.slug}#physician`),
    name: professional.name,
    description: professional.summary,
    url: absoluteUrl(`/team/${professional.slug}`),
    telephone: professional.phone,
    email: professional.email,
    medicalSpecialty: professional.disciplines.map((discipline) =>
      discipline === "occupational-therapy"
        ? "OccupationalTherapy"
        : discipline === "speech-language"
          ? "SpeechPathology"
          : "Audiology",
    ),
    knowsLanguage: professional.languages,
    worksFor: { "@id": absoluteUrl("/#organization") },
    alumniOf: professional.credentials
      .filter((credential) => credential.institution)
      .map((credential) => ({
        "@type": "CollegeOrUniversity",
        name: credential.institution,
      })),
  };
}

/** A service offering. */
export function serviceJsonLd(service: Service): JsonLd {
  const cheapest = [...service.prices].sort((a, b) => a.amountInr - b.amountInr)[0];
  return {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    "@id": absoluteUrl(`/services#${service.slug}`),
    name: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.discipline}`),
    provider: { "@id": absoluteUrl("/#organization") },
    ...(cheapest
      ? {
          offers: {
            "@type": "Offer",
            price: cheapest.amountInr,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** A condition page as a MedicalCondition with its FAQ. */
export function conditionJsonLd(condition: Condition): JsonLd[] {
  const conditionDoc: JsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": absoluteUrl(`/conditions/${condition.slug}#page`),
    name: condition.title,
    description: condition.summary,
    url: absoluteUrl(`/conditions/${condition.slug}`),
    about: {
      "@type": "MedicalCondition",
      name: condition.title,
    },
    inLanguage: "en-IN",
  };
  return [conditionDoc, faqJsonLd(condition.faq)];
}

/** A FAQ block. */
export function faqJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** A breadcrumb trail. */
export function breadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** A blog article. */
export function articleJsonLd(post: BlogPost): JsonLd {
  const author = professionals.find((item) => item.id === post.authorId);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`/blog/${post.slug}#article`),
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en-IN",
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };
}
