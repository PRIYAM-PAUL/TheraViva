"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Spinner } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";

export interface AuthGuardProps {
  children: React.ReactNode;
  /** Require the `admin` role (redirects patients to their own dashboard). */
  requireAdmin?: boolean;
}

/**
 * Client-side route guard.
 *
 * Server components cannot read the in-memory auth state, so guarding happens on
 * the client. Unauthenticated visitors are redirected to `/login`; patients
 * hitting an admin-only page are sent to `/dashboard`.
 */
export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, requireAdmin, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner label="Checking your session" className="size-6" />
      </div>
    );
  }
  if (!user) return null;
  if (requireAdmin && user.role !== "admin") return null;
  return <>{children}</>;
}
