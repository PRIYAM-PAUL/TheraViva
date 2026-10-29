"use client";

import { CalendarDays } from "lucide-react";
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
  Select,
  Spinner,
} from "@/components/ui";
import { useAppointments } from "@/features/dashboard/queries";
import type { Appointment } from "@/features/dashboard/types";
import { ApiError, api } from "@/lib/api";
import { formatDateShort, formatTime } from "@/lib/format";

const STAFF_ROLES = ["reception", "therapist", "admin"] as const;

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "requested", label: "Requested" },
  { value: "held", label: "Held" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No-show" },
];

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateShort(date)} · ${formatTime(date)}`;
}

function StaffAppointments() {
  const [status, setStatus] = React.useState("all");
  const { data, loading, error, reload } = useAppointments(
    status === "all" ? {} : { status },
  );
  const [busyRef, setBusyRef] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const setStatusFor = async (reference: string, next: string) => {
    setBusyRef(reference);
    setActionError(null);
    try {
      await api.appointments.updateStatus(reference, next);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not update the appointment.");
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
      header: "Actions",
      align: "right",
      render: (row) => {
        const busy = busyRef === row.reference;
        if (row.status === "cancelled" || row.status === "completed") return null;
        return (
          <div className="flex flex-wrap justify-end gap-2">
            {row.status === "requested" || row.status === "held" ? (
              <Button
                size="sm"
                loading={busy}
                onClick={() => void setStatusFor(row.reference, "confirmed")}
              >
                Confirm
              </Button>
            ) : null}
            {row.status === "confirmed" ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  loading={busy}
                  onClick={() => void setStatusFor(row.reference, "completed")}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  loading={busy}
                  onClick={() => void setStatusFor(row.reference, "no_show")}
                >
                  No-show
                </Button>
              </>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              loading={busy}
              onClick={() => void setStatusFor(row.reference, "cancelled")}
            >
              Cancel
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Confirm requests, mark sessions complete and handle cancellations."
        actions={
          <div className="w-48">
            <Select
              options={STATUS_FILTERS}
              value={status}
              onValueChange={setStatus}
              placeholder="Filter by status"
            />
          </div>
        }
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
              emptyLabel="No appointments match this filter."
            />
          )}
          {!loading && (data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={CalendarDays}
                title="Nothing here"
                description="Appointments will appear as patients book and you confirm them."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffAppointmentsPage() {
  return (
    <AuthGuard requireRoles={[...STAFF_ROLES]}>
      <StaffAppointments />
    </AuthGuard>
  );
}
