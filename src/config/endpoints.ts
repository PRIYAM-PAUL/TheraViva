/**
 * Service endpoint conventions shared by every future backend service.
 *
 * Follows standard web/operations conventions so integration is predictable:
 *   - RFC 9116 — security.txt
 *   - W3C      — Web App Manifest (manifest.webmanifest)
 *   - RFC 9309 — Robots Exclusion Protocol (robots.txt)
 *   - sitemaps.org — XML Sitemap
 *   - Health/readiness probe naming used by Kubernetes and cloud load balancers
 *   - Prometheus text exposition for metrics
 *   - URI path versioning for HTTP APIs
 *
 * No backend is connected; these constants document the agreed locations.
 */

export const SERVICE_ENDPOINTS = {
  /** Liveness probe. */
  health: "/healthz",
  /** Readiness probe. */
  readiness: "/readyz",
  /** Prometheus-format metrics. */
  metrics: "/metrics",
  /** Build/version information. */
  version: "/version",
  /** Versioned HTTP API roots. */
  api: {
    v1: "/api/v1",
  },
} as const;

/** RFC 8615 well-known locations for general web standards. */
export const WELL_KNOWN = {
  /** RFC 9116 security.txt. */
  security: "/.well-known/security.txt",
  /** W3C Change Password URL. */
  changePassword: "/.well-known/change-password",
  /** W3C Web App Manifest. */
  manifest: "/manifest.webmanifest",
  /** RFC 9309 robots.txt. */
  robots: "/robots.txt",
  /** sitemaps.org XML sitemap. */
  sitemap: "/sitemap.xml",
} as const;

/** Default cache-control for static, non-sensitive responses (seconds). */
export const STATIC_CACHE_SECONDS = 3600;
