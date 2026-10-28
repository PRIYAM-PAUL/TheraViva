"use client";

import { Activity, BarChart3, Receipt, Search, Users } from "lucide-react";
import * as React from "react";

import {
  AuthGuard,
  BarChart,
  DataTable,
  EmptyState,
  KpiCard,
  StatusBadge,
  type Column,
} from "@/components/dashboard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@/components/ui";
import { useAdminDashboard } from "@/features/dashboard/queries";
import type { RecentAuditRow, RecentIntakeRow } from "@/features/dashboard/types";
import { formatRupees } from "@/lib/format";

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const intakeColumns: Column<RecentIntakeRow>[] = [
  { key: "reference", header: "Reference" },
  { key: "kind", header: "Type" },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  {
    key: "createdAt",
    header: "Received",
    render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
  },
];

const auditColumns: Column<RecentAuditRow>[] = [
  { key: "action", header: "Action" },
  { key: "entityType", header: "Entity" },
  { key: "actorRole", header: "Actor", render: (row) => row.actorRole ?? "system" },
  {
    key: "createdAt",
    header: "When",
    render: (row) => new Date(row.createdAt).toLocaleString("en-IN"),
  },
];

function AdminDashboardView() {
  const [days, setDays] = React.useState(30);
  const to = React.useMemo(() => isoDay(new Date()), []);
  const from = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return isoDay(date);
  }, [days]);

  const { data, loading, error } = useAdminDashboard(from, to);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Practice admin</h1>
          <p className="text-sm text-muted-foreground">
            Billing, payments, engagement and SEO for {from} → {to}.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {RANGES.map((range) => (
            <Button
              key={range.days}
              type="button"
              size="sm"
              variant={days === range.days ? "primary" : "ghost"}
              onClick={() => setDays(range.days)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load the dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner label="Loading the admin dashboard" className="size-6" />
        </div>
      ) : null}

      {!loading && data ? (
        <>
          {!data.hasRecords ? (
            <EmptyState
              icon={BarChart3}
              title="No activity yet"
              description="KPIs fill in as appointments, invoices, payments and engagement events arrive."
            />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((kpi) => (
              <KpiCard
                key={kpi.key}
                label={kpi.label}
                value={kpi.unit === "INR" ? formatRupees(kpi.value) : String(kpi.value)}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="size-5 text-primary" aria-hidden="true" />
                  Revenue collected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.revenueByDay.map((point) => ({
                    label: point.day,
                    value: point.value,
                  }))}
                  formatValue={(value) => formatRupees(value)}
                  emptyLabel="No payments in this range."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5 text-primary" aria-hidden="true" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={data.engagementByDay.map((point) => ({
                    label: point.day,
                    value: point.value,
                  }))}
                  emptyLabel="No engagement events in this range."
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-primary" aria-hidden="true" />
                  Appointments by status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={Object.entries(data.appointmentsByStatus).map(([status, count]) => ({
                    label: status.replace(/_/g, " "),
                    value: count,
                  }))}
                  emptyLabel="No appointments yet."
                />
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
                  {Object.entries(data.intakeByKind).map(([kind, count]) => (
                    <div key={kind}>
                      <p className="font-medium text-foreground">{count}</p>
                      <p className="text-xs text-muted-foreground">{kind}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="size-5 text-primary" aria-hidden="true" />
                  SEO &amp; top pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="font-medium">{data.seo.impressions}</p>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                  </div>
                  <div>
                    <p className="font-medium">{data.seo.clicks}</p>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                  </div>
                  <div>
                    <p className="font-medium">{(data.seo.ctr * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                  <div>
                    <p className="font-medium">{data.seo.averagePosition.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg. position</p>
                  </div>
                </div>
                <BarChart
                  data={data.topPages.map((page) => ({ label: page.path, value: page.views }))}
                  emptyLabel="No page views recorded yet."
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent intake</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={intakeColumns}
                rows={data.recentIntake}
                rowKey={(row) => `${row.kind}-${row.id}`}
                emptyLabel="No intake submissions yet."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={auditColumns}
                rows={data.recentAudit}
                rowKey={(row) => row.id}
                emptyLabel="No audit entries yet."
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminDashboardView />
    </AuthGuard>
  );
}
