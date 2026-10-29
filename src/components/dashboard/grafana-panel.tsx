"use client";

import { ExternalLink, LineChart } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

/**
 * Embeds a Grafana dashboard (read from Prometheus `/metrics`).
 *
 * Configure with `NEXT_PUBLIC_GRAFANA_URL` and `NEXT_PUBLIC_GRAFANA_DASHBOARD_UID`.
 * The origin must also be allowed in the CSP `frame-src` (see `next.config.ts`).
 * When unset, an honest setup card is shown instead of a broken frame.
 */
export function GrafanaPanel() {
  const base = process.env.NEXT_PUBLIC_GRAFANA_URL?.replace(/\/+$/, "");
  const uid = process.env.NEXT_PUBLIC_GRAFANA_DASHBOARD_UID;

  if (!base || !uid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="size-5 text-primary" aria-hidden="true" />
            Grafana
          </CardTitle>
          <CardDescription>
            Not connected. Start the local stack (<code>docker compose up</code> in the
            repository root) and set <code>NEXT_PUBLIC_GRAFANA_URL</code> and{" "}
            <code>NEXT_PUBLIC_GRAFANA_DASHBOARD_UID</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The backend exposes Prometheus metrics at <code>/metrics</code>; the
            bundled stack scrapes them and provisions a TheraViva dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  const src = `${base}/d/${uid}?kiosk&theme=light`;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <LineChart className="size-5 text-primary" aria-hidden="true" />
          Grafana
        </CardTitle>
        <a
          href={`${base}/d/${uid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Open in Grafana
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <iframe
            src={src}
            title="Grafana dashboard"
            className="h-[32rem] w-full"
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>
  );
}
