"use client";

import { ShieldCheck, UserPlus } from "lucide-react";
import * as React from "react";

import {
  AuthGuard,
  DataTable,
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
  CardHeader,
  CardTitle,
  Field,
  Input,
  Select,
  Spinner,
} from "@/components/ui";
import { useAdminUsers } from "@/features/dashboard/queries";
import type { StaffUser } from "@/features/dashboard/types";
import { ApiError, api } from "@/lib/api";

const ROLE_OPTIONS = [
  { value: "reception", label: "Reception" },
  { value: "therapist", label: "Therapist" },
  { value: "admin", label: "Admin" },
];

function TeamManagement() {
  const { data, loading, error, reload } = useAdminUsers();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("reception");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("create");
    setFormError(null);
    setNotice(null);
    try {
      await api.admin.createUser({
        email: email.trim(),
        password,
        role,
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      setEmail("");
      setName("");
      setPassword("");
      setNotice("Staff account created.");
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not create the account.");
    } finally {
      setBusy(null);
    }
  };

  const toggleActive = async (user: StaffUser) => {
    setBusy(user.id);
    setFormError(null);
    try {
      await api.admin.updateUser(user.id, { isActive: !user.isActive });
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not update the account.");
    } finally {
      setBusy(null);
    }
  };

  const columns: Column<StaffUser>[] = [
    { key: "name", header: "Name", render: (row) => row.name ?? "—" },
    { key: "email", header: "Email", render: (row) => row.email ?? "—" },
    { key: "role", header: "Role", render: (row) => <StatusBadge status={row.role} /> },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (row.isActive ? "Active" : "Disabled"),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          loading={busy === row.id}
          onClick={() => void toggleActive(row)}
        >
          {row.isActive ? "Disable" : "Enable"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        description="Create staff accounts and control who can access the practice area."
      />

      {formError ? (
        <Alert variant="destructive">
          <AlertTitle>Action failed</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      {notice ? (
        <Alert variant="info">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" aria-hidden="true" />
            New staff account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
            <Field id="staff-name" label="Name">
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field id="staff-new-email" label="Email">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field id="staff-new-password" label="Temporary password">
              <Input
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
            <Field id="staff-role" label="Role">
              <Select options={ROLE_OPTIONS} value={role} onValueChange={setRole} />
            </Field>
            <Button type="submit" loading={busy === "create"}>
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load the team</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            Staff accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner label="Loading staff" className="size-6" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(row) => row.id}
              emptyLabel="No staff accounts yet."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StaffUsersPage() {
  return (
    <AuthGuard requireRoles={["admin"]}>
      <TeamManagement />
    </AuthGuard>
  );
}
