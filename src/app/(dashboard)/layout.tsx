import type { Metadata } from "next";
import * as React from "react";

import { DashboardHeader } from "@/components/dashboard";
import { AuthProvider } from "@/features/dashboard/auth-context";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Patient and practice dashboards.",
  // Authenticated area: never index.
  robots: { index: false, follow: false },
};

/** Shell for the authenticated dashboard area. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-dvh flex-col bg-background">
        <DashboardHeader />
        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
        >
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
