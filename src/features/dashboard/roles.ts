/**
 * Role helpers for the dashboards.
 *
 * The backend is the real authorization boundary (`require_role`); these helpers
 * only drive client-side routing and which navigation a user sees.
 */

import type { UserRole } from "@/features/dashboard/types";

/** Staff roles share the password login flow and the staff area. */
export const STAFF_ROLES: readonly UserRole[] = ["reception", "therapist", "admin"] as const;

export function isStaffRole(role: UserRole | null | undefined): boolean {
  return role != null && STAFF_ROLES.includes(role);
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

const ROLE_LABELS: Record<UserRole, string> = {
  patient: "Patient",
  reception: "Reception",
  therapist: "Therapist",
  admin: "Admin",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

/** Where a user should land after signing in, based on their role. */
export function homePathForRole(role: UserRole): string {
  return role === "patient" ? "/dashboard" : "/staff";
}
