import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Fraunces,
  Geist,
  Geist_Mono,
  Karla,
  Manrope,
  Newsreader,
  Nunito,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { AnalyticsScripts, ConsentBanner, ConsentProvider } from "@/components/analytics";
import { EngagementBeacon } from "@/components/analytics/engagement-beacon";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider, ThemeScript } from "@/components/theme";
import { siteConfig } from "@/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

/*
 * Font families are bound to CSS variables on <html>. Themes re-point
 * `--font-body` / `--font-heading` at these (see src/styles/themes.css), which
 * is what changes the typographic character per theme. Only the families used
 * by at least one theme are loaded.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  fraunces.variable,
  nunito.variable,
  manrope.variable,
  newsreader.variable,
  cormorant.variable,
  karla.variable,
  plusJakarta.variable,
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1115" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${fontVariables} h-full antialiased`}
      // The no-flash script sets `data-theme` / `color-scheme` on <html> before
      // hydration, so the server and client attribute lists differ by design.
      // This suppresses only that one-element attribute diff, not real errors.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeScript />
        <ThemeProvider>
          <ConsentProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
              Skip to content
            </a>
            {children}
            <ConsentBanner />
            <AnalyticsScripts />
            <EngagementBeacon />
          </ConsentProvider>
          <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        </ThemeProvider>
      </body>
    </html>
  );
}
