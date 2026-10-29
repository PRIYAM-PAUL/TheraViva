"use client";

import { FileText } from "lucide-react";
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
import { useAdminIntake } from "@/features/dashboard/queries";
import { ApiError, api } from "@/lib/api";

const KINDS = [
  { value: "appointment-requests", label: "Appointment requests" },
  { value: "enquiries", label: "Enquiries" },
  { value: "referrals", label: "Referrals" },
];

const STATUSES = ["received", "contacted", "scheduled", "closed", "cancelled"];

type IntakeRow = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function StaffIntake() {
  const [kind, setKind] = React.useState("appointment-requests");
  const { data, loading, error, reload } = useAdminIntake(kind);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const update = async (id: string, status: string) => {
    setBusyId(id);
    setActionError(null);
    try {
      await api.admin.updateIntake(kind, id, status);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not update.");
    } finally {
      setBusyId(null);
    }
  };

  const columns: Column<IntakeRow>[] = [
    { key: "reference", header: "Reference", render: (row) => asString(row.reference) },
    {
      key: "name",
      header: "From",
      render: (row) => asString(row.fullName) || asString(row.name) || asString(row.referrerName) || "—",
    },
    {
      key: "phone",
      header: "Contact",
      render: (row) => asString(row.phone) || asString(row.email) || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={asString(row.status)} />,
    },
    {
      key: "createdAt",
      header: "Received",
      render: (row) => new Date(asString(row.createdAt)).toLocaleDateString("en-IN"),
    },
    {
      key: "actions",
      header: "Set status",
      align: "right",
      render: (row) => (
        <div className="flex flex-wrap justify-end gap-1">
          {STATUSES.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={asString(row.status) === status ? "primary" : "ghost"}
              loading={busyId === asString(row.id) && asString(row.status) !== status}
              onClick={() => void update(asString(row.id), status)}
            >
              {status}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Intake"
        description="Requests, enquiries and referrals submitted from the public site."
        actions={
          <div className="w-56">
            <Select options={KINDS} value={kind} onValueChange={setKind} placeholder="Type" />
          </div>
        }
      />

      {actionError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not update the record</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load intake</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading intake" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => asString(row.id)}
              emptyLabel="Nothing submitted yet."
            />
          )}
          {!loading && (data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={FileText}
                title="No submissions"
                description="Requests from the booking page and contact form appear here."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffIntakePage() {
  return (
    <AuthGuard requireRoles={["reception", "admin"]}>
      <StaffIntake />
    </AuthGuard>
  );
}
