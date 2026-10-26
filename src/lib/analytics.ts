/**
 * Analytics helpers.
 *
 * No analytics SDK is loaded unless a measurement id is configured AND the
 * visitor has consented (see the consent banner). These helpers are therefore
 * safe no-ops by default.
 */

type AnalyticsParams = Record<string, unknown>;

interface AnalyticsWindow {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

function analyticsWindow(): AnalyticsWindow | null {
  if (typeof window === "undefined") return null;
  return window as unknown as AnalyticsWindow;
}

/** Send a custom event to GA4 and Meta Pixel, if either is loaded. */
export function trackEvent(name: string, params?: AnalyticsParams): void {
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
