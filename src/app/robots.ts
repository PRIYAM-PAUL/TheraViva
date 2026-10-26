import type { MetadataRoute } from "next";

import { siteConfig } from "@/config";

/**
 * RFC 9309 robots.txt.
 *
 * The whole public site is crawlable. There are no private areas in this phase
 * (no patient portal or admin), so nothing is disallowed beyond API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
