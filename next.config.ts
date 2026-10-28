import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Origin of the TheraViva backend API, added to `connect-src` so the dashboards
 * can call it. Configure with NEXT_PUBLIC_API_URL; in development the local
 * backend is allowed by default.
 */
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiOrigins = (() => {
  const origins = new Set<string>();
  const add = (value: string | undefined) => {
    if (!value) return;
    try {
      origins.add(new URL(value).origin);
    } catch {
      /* ignore malformed values */
    }
  };
  add(configuredApiUrl);
  if (isDev) add("http://localhost:8000");
  return [...origins].join(" ");
})();

/**
 * Content Security Policy.
 *
 * This is a static policy (no per-request nonce) so every route stays statically
 * rendered. `'unsafe-inline'` is required for Next's hydration bootstrap and for
 * the theme/JSON-LD inline scripts; it can be tightened to a nonce later by
 * moving this into `src/proxy.ts`, which forces dynamic rendering.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' " +
    apiOrigins +
    " https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.facebook.com https://connect.facebook.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Response headers applied to every route. */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
