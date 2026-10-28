"use client";

import Link from "next/link";

import { useConsent } from "@/components/analytics/consent-provider";
import { Button } from "@/components/ui";

/**
 * Cookie/analytics consent banner.
 *
 * Shown until the visitor makes a choice. Nothing beyond the decision itself is
 * stored, and no analytics load until "Accept" is chosen.
 */
export function ConsentBanner() {
  const { consent, ready, grant, deny } = useConsent();

  if (!ready || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      // Sits above the sticky mobile action bar (`floating-actions`) so it never
      // covers the Call / WhatsApp / Book buttons while it is visible.
      className="fixed inset-x-3 bottom-20 z-50 rounded-xl border border-border bg-card p-4 shadow-lifted sm:inset-x-auto sm:right-4 sm:max-w-md lg:bottom-4"
    >
      <p className="text-sm font-medium text-foreground">
        We&apos;d like to measure how this site is used
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        With your permission we use Google Analytics to understand which pages
        help people. No health information is ever tracked.{" "}
        <Link href="/legal/privacy" className="text-primary underline-offset-4 hover:underline">
          Privacy details
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <Button type="button" size="sm" onClick={grant}>
          Accept
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={deny}>
          Decline
        </Button>
      </div>
    </div>
  );
}
