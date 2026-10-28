/**
 * Analytics helpers.
 *
 * No analytics SDK is loaded unless a measurement id is configured AND the
 * visitor has consented (see the consent banner). As a second line of defence,
 * the helpers below refuse to send anything unless consent is present, so a
 * future caller cannot accidentally track without it.
 */

type AnalyticsParams = Record<string, unknown>;

/** `localStorage` key holding the visitor's analytics-consent decision. */
export const CONSENT_STORAGE_KEY = "theraviva.consent.v1";

interface AnalyticsWindow {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

function analyticsWindow(): AnalyticsWindow | null {
  if (typeof window === "undefined") return null;
  return window as unknown as AnalyticsWindow;
}

/** Whether the visitor has explicitly granted analytics consent. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "granted";
  } catch {
    return false;
  }
}

/** Send a custom event to GA4 and Meta Pixel, if either is loaded and allowed. */
export function trackEvent(name: string, params?: AnalyticsParams): void {
  if (!hasAnalyticsConsent()) return;

  const target = analyticsWindow();
  if (!target) return;
  target.gtag?.("event", name, params ?? {});
  target.fbq?.("trackCustom", name, params ?? {});
}

/** Track a lead/booking request (the primary conversion on this site). */
export function trackLead(method: "whatsapp" | "email" | "phone", context?: string): void {
  trackEvent("generate_lead", { method, context });
}

/** Track a click on an outbound contact action. */
export function trackContact(method: "whatsapp" | "email" | "phone"): void {
  trackEvent("contact_click", { method });
}
