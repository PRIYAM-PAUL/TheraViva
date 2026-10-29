"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Spinner } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";
import { homePathForRole } from "@/features/dashboard/roles";
import type { UserRole } from "@/features/dashboard/types";

export interface AuthGuardProps {
  children: React.ReactNode;
  /** Require one of these roles (users with another role are redirected home). */
  requireRoles?: UserRole[];
}

/**
 * Client-side route guard.
 *
 * Server components cannot read the in-memory auth state, so guarding happens on
 * the client (the Next proxy does the coarse, pre-render gate). Unauthenticated
 * visitors are redirected to `/login`; a signed-in user hitting a page their role
 * cannot access is sent to their own home.
 */
export function AuthGuard({ children, requireRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const allowed = React.useMemo(
    () => (requireRoles && user ? requireRoles.includes(user.role) : true),
    [requireRoles, user],
  );

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireRoles && !requireRoles.includes(user.role)) {
      router.replace(homePathForRole(user.role));
    }
  }, [loading, user, requireRoles, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner label="Checking your session" className="size-6" />
      </div>
    );
  }
  if (!user) return null;
  if (!allowed) return null;
  return <>{children}</>;
}
