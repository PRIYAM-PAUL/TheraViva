/**
 * Site-wide configuration: identity, navigation, contact and footer content.
 *
 * TODO(content): `contact.email` currently uses a practitioner's email and the
 * address/hours are placeholders. Replace with the practice's official contact
 * details before launch, and keep them identical to the Google Business Profile
 * (NAP consistency matters for local SEO).
 */

import type { Option } from "@/types";

export const DEFAULT_LOCALE = "en-IN";
export const DEFAULT_CURRENCY = "INR";

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    email: string;
    phone: string;
    /** Digits only, with country code, for wa.me links. */
    whatsapp: string;
    addressLines: string[];
    city: string;
    hours: string[];
    /** GST number, if the practice is registered. Empty hides it in the footer. */
    gstin: string;
  };
  primaryNav: NavItem[];
  footerNav: { title: string; items: NavItem[] }[];
  social: { label: string; href: string }[];
  /** Default WhatsApp message body when a visitor taps a WhatsApp CTA. */
  whatsappGreeting: string;
}

export const siteConfig: SiteConfig = {
  name: "TheraViva",
  tagline: "Occupational therapy, speech therapy & audiology in Delhi",
  description:
    "TheraViva is a Delhi-based occupational therapy, speech-and-language and audiology practice. Assessment-led therapy for children and adults, in clinic, at home and online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    email: "78609910mdirfan@gmail.com",
    phone: "+91 7838696558",
    whatsapp: "917838696558",
    addressLines: ["Clinic address to be confirmed"],
    city: "New Delhi",
    hours: [
      "Monday – Friday: 9:00 am – 7:00 pm",
      "Saturday: 9:00 am – 5:00 pm",
      "Sunday: By appointment",
    ],
    gstin: "",
  },
  primaryNav: [
    { label: "Services", href: "/services" },
    { label: "Conditions", href: "/conditions" },
    { label: "Team", href: "/team" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ],
  footerNav: [
    {
      title: "Services",
      items: [
        { label: "Occupational Therapy", href: "/services/occupational-therapy" },
        { label: "Speech & Language", href: "/services/speech-language" },
        { label: "Audiology", href: "/services/audiology" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Practice",
      items: [
        { label: "Our team", href: "/team" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
        { label: "Refer a client", href: "/referral" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Conditions",
      items: [
        { label: "Autism (ASD)", href: "/conditions/autism-spectrum-disorder" },
        { label: "Speech & language delay", href: "/conditions/speech-language-delay" },
        { label: "Sensory processing", href: "/conditions/sensory-processing" },
        { label: "Handwriting", href: "/conditions/handwriting" },
        { label: "Hearing loss", href: "/conditions/hearing-loss" },
        { label: "All conditions", href: "/conditions" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Refunds & cancellation", href: "/legal/refund" },
        { label: "Medical disclaimer", href: "/legal/disclaimer" },
        { label: "Accessibility", href: "/legal/accessibility" },
      ],
    },
  ],
  // TODO(content): add verified social profiles.
  social: [],
  whatsappGreeting:
    "Hello TheraViva, I'd like to ask about therapy for ",
};

/** Delivery-mode options for forms. */
export const modeOptions: Option[] = [
  { value: "in-person", label: "In clinic / home visit" },
  { value: "video", label: "Online video session" },
  { value: "phone", label: "Phone / WhatsApp call" },
];
