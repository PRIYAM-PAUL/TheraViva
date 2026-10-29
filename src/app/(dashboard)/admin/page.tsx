"use client";

import { AdminDashboardView, AuthGuard } from "@/components/dashboard";

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireRoles={["admin"]}>
      <AdminDashboardView />
    </AuthGuard>
  );
}
