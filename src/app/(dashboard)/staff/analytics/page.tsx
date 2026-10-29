"use client";

import { AdminDashboardView, AuthGuard, GrafanaPanel } from "@/components/dashboard";

export default function StaffAnalyticsPage() {
  return (
    <AuthGuard requireRoles={["admin"]}>
      <div className="space-y-10">
        <AdminDashboardView />
        <GrafanaPanel />
      </div>
    </AuthGuard>
  );
}
