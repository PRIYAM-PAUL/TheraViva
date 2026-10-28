"use client";

/**
 * First-party engagement beacon.
 *
 * Records anonymous page views to the backend so the admin dashboard has
 * traffic data. Deliberately privacy-preserving:
 *   - no cookies and no persistent identifiers (session id lives in
 *     `sessionStorage` and is regenerated per tab),
 *   - no personal data, no query strings, no referrer beyond the origin,
 *   - silently does nothing when the API is not configured.
 */

import { usePathname } from "next/navigation";
import * as React from "react";

import { API_PATHS, apiBaseUrl, isApiConfigured } from "@/config/api";

const SESSION_KEY = "theraviva.engagement.session";

function getSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

function getDevice(): string {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function EngagementBeacon() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isApiConfigured) return;
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

    const payload = {
      eventType: "page_view",
      path: pathname,
      sessionId: getSessionId(),
      device: getDevice(),
    };

    void fetch(`${apiBaseUrl}${API_PATHS.engagement}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the page */
    });
  }, [pathname]);

  return null;
}
