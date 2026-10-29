"use client";

import { Users } from "lucide-react";

import {
  AuthGuard,
  DataTable,
  EmptyState,
  PageHeader,
  type Column,
} from "@/components/dashboard";
import { Alert, AlertDescription, AlertTitle, Card, CardContent, Spinner } from "@/components/ui";
import { useStaffPatients } from "@/features/dashboard/queries";
import type { StaffUser } from "@/features/dashboard/types";

const columns: Column<StaffUser>[] = [
  { key: "name", header: "Name", render: (row) => row.name ?? "—" },
  { key: "phone", header: "Phone", render: (row) => row.phone ?? "—" },
  { key: "email", header: "Email", render: (row) => row.email ?? "—" },
  {
    key: "createdAt",
    header: "Registered",
    render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
  },
];

function StaffPatients() {
  const { data, loading, error } = useStaffPatients();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Patients"
        description="Everyone who has signed in to the patient portal."
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load patients</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner label="Loading patients" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No patients registered yet."
            />
          )}
          {!loading && (data?.items.length ?? 0) === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={Users}
                title="No patients yet"
                description="Patients appear once they sign in with a phone number."
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffPatientsPage() {
  return (
    <AuthGuard requireRoles={["reception", "therapist", "admin"]}>
      <StaffPatients />
    </AuthGuard>
  );
}
