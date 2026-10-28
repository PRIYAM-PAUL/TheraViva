import { ImageResponse } from "next/og";

import { siteConfig } from "@/config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph / Twitter card image for the site.
 *
 * Generated at build time so social previews are never blank. Pages can still
 * override it with their own `opengraph-image`.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 55%, #fffbeb 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f0fdfa",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            +
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#0f766e" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#1c1917",
              maxWidth: 960,
            }}
          >
            Therapy that helps people take part in everyday life
          </div>
          <div style={{ fontSize: 30, color: "#57534e" }}>
            Occupational therapy · Speech &amp; language · Audiology — Delhi
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
