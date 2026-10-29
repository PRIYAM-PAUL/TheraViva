"use client";

import { CalendarDays, FileText, Receipt, Wallet } from "lucide-react";

import {
  AuthGuard,
  DataTable,
  EmptyState,
  KpiCard,
  PayOnlineButton,
  StatusBadge,
  type Column,
} from "@/components/dashboard";
import { Alert, AlertDescription, AlertTitle, Card, CardContent, CardHeader, CardTitle, Spinner } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";
import { usePatientDashboard } from "@/features/dashboard/queries";
import type { Appointment, Invoice, Payment } from "@/features/dashboard/types";
import { formatDateShort, formatRupees, formatTime } from "@/lib/format";

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateShort(date)} · ${formatTime(date)}`;
}

const appointmentColumns: Column<Appointment>[] = [
  { key: "reference", header: "Reference" },
  { key: "serviceSlug", header: "Service" },
  { key: "mode", header: "Format" },
  { key: "startsAt", header: "When", render: (row) => when(row.startsAt) },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
];

function invoiceColumns(onPaid: () => void): Column<Invoice>[] {
  return [
    { key: "number", header: "Invoice" },
    { key: "description", header: "For" },
    { key: "totalInr", header: "Total", align: "right", render: (row) => formatRupees(row.totalInr) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) =>
        row.status === "issued" ? (
          <PayOnlineButton invoiceId={row.id} amountInr={row.totalInr} onPaid={onPaid} />
        ) : null,
    },
  ];
}

const paymentColumns: Column<Payment>[] = [
  { key: "createdAt", header: "Date", render: (row) => formatDateShort(new Date(row.createdAt)) },
  { key: "method", header: "Method", render: (row) => row.method ?? "—" },
  { key: "amountInr", header: "Amount", align: "right", render: (row) => formatRupees(row.amountInr) },
  { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
];

function PatientDashboardView() {
  const { user } = useAuth();
  const { data, loading, error, reload } = usePatientDashboard(Boolean(user));

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner label="Loading your dashboard" className="size-6" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load your dashboard</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {user?.name ? `Welcome, ${user.name}` : "Your dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Your appointments, invoices and payments in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Upcoming" value={String(data.upcomingAppointments.length)} hint="Appointments ahead" />
        <KpiCard label="Paid to date" value={formatRupees(data.paidInr)} />
        <KpiCard label="Outstanding" value={formatRupees(data.outstandingInr)} />
        <KpiCard label="Invoices" value={String(data.invoices.length)} />
      </div>

      {!data.hasRecords ? (
        <EmptyState
          icon={CalendarDays}
          title="No history yet"
          description="Once you book an appointment or receive an invoice, it will appear here."
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            Upcoming appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={appointmentColumns}
            rows={data.upcomingAppointments}
            rowKey={(row) => row.id}
            emptyLabel="No upcoming appointments."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" aria-hidden="true" />
            Past appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={appointmentColumns}
            rows={data.pastAppointments}
            rowKey={(row) => row.id}
            emptyLabel="No past appointments."
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-5 text-primary" aria-hidden="true" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={invoiceColumns(reload)}
              rows={data.invoices}
              rowKey={(row) => row.id}
              emptyLabel="No invoices yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-5 text-primary" aria-hidden="true" />
              Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={paymentColumns}
              rows={data.payments}
              rowKey={(row) => row.id}
              emptyLabel="No payments yet."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <AuthGuard>
      <PatientDashboardView />
    </AuthGuard>
  );
}
