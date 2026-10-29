"use client";

import { CalendarDays, XCircle } from "lucide-react";
import * as React from "react";

import {
  AuthGuard,
  DataTable,
  EmptyState,
  PageHeader,
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
  Spinner,
} from "@/components/ui";
import { useAppointments } from "@/features/dashboard/queries";
import type { Appointment } from "@/features/dashboard/types";
import { ApiError, api } from "@/lib/api";
import { formatDateShort, formatTime } from "@/lib/format";

const TERMINAL = new Set(["cancelled", "completed", "no_show"]);

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateShort(date)} · ${formatTime(date)}`;
}

function PatientAppointments() {
  const { data, loading, error, reload } = useAppointments();
  const [busyRef, setBusyRef] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const cancel = async (reference: string) => {
    setBusyRef(reference);
    setActionError(null);
    try {
      await api.appointments.cancel(reference);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not cancel.");
    } finally {
      setBusyRef(null);
    }
  };

  const columns: Column<Appointment>[] = [
    { key: "reference", header: "Reference" },
    { key: "serviceSlug", header: "Service" },
    { key: "mode", header: "Format" },
    { key: "startsAt", header: "When", render: (row) => when(row.startsAt) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) =>
        TERMINAL.has(row.status) ? null : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={busyRef === row.reference}
            onClick={() => void cancel(row.reference)}
          >
            <XCircle className="size-4" aria-hidden="true" />
            Cancel
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="My appointments"
        description="Every appointment you have booked, past and upcoming."
      />

      {actionError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not update the appointment</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load appointments</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading appointments" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No appointments yet. Book one from the booking page."
            />
          )}
          {!loading && (data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={CalendarDays}
                title="No appointments yet"
                description="Once you book, your appointments appear here with their reference and status."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PatientAppointmentsPage() {
  return (
    <AuthGuard requireRoles={["patient"]}>
      <PatientAppointments />
    </AuthGuard>
  );
}
