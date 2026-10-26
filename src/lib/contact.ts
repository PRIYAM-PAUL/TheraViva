import { siteConfig } from "@/config";

/** Build a WhatsApp deep link with an optional prefilled message. */
export function whatsAppLink(message?: string): string {
  const text = message ?? siteConfig.whatsappGreeting;
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** Build a `tel:` link from a human-readable phone number. */
export function telLink(phone: string = siteConfig.contact.phone): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Build a `mailto:` link with a subject and body. */
export function mailtoLink(
  subject: string,
  body: string,
  email: string = siteConfig.contact.email,
): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email}?${params.toString()}`;
}

/** A short, friendly WhatsApp message for a given service or enquiry. */
export function enquiryMessage(subject?: string): string {
  return subject
    ? `Hello ${siteConfig.name}, I'd like to ask about ${subject}.`
    : siteConfig.whatsappGreeting;
}
