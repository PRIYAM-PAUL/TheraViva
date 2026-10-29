import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Coarse, pre-render routing for the authenticated areas.
 *
 * This runs before render and can only see a non-sensitive routing-hint cookie
 * (the user's role), never the token — which lives in `localStorage`. It is
 * therefore **not** an authentication gate: it must never redirect to `/login`,
 * because the client `AuthGuard` (which owns the token) would immediately
 * redirect back, producing an infinite loop.
 *
 * It only enforces *area separation* when the cookie names a role it recognises:
 * patients stay in `/dashboard`, staff stay in `/staff`, only admins in `/admin`.
 * Every other case falls through and the client guard decides. The backend
 * remains the real authorization boundary (`require_role`).
 */

const HINT_COOKIE = "theraviva.session";
const KNOWN_ROLES = new Set(["patient", "reception", "therapist", "admin"]);
const STAFF_ROLES = new Set(["reception", "therapist", "admin"]);

function homeFor(role: string): string {
  return role === "patient" ? "/dashboard" : "/staff";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(HINT_COOKIE)?.value ?? "";
  // Only act on a role we recognise. An absent or unexpected value means we have
  // no reliable signal — defer to the client guard rather than guess (guessing is
  // what caused the redirect loop).
  const role = KNOWN_ROLES.has(raw) ? raw : null;

  if (!role) return NextResponse.next();

  const isStaff = STAFF_ROLES.has(role);

  // Already signed in: keep the user out of the login page.
  if (pathname === "/login") {
    return NextResponse.redirect(new URL(homeFor(role), request.url));
  }

  // Area separation for a known role. Each target is a valid home for that role,
  // so these redirects can never cycle.
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(homeFor(role), request.url));
  }
  if (pathname.startsWith("/staff") && !isStaff) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard") && role !== "patient") {
    return NextResponse.redirect(new URL(homeFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/staff/:path*", "/admin/:path*", "/login"],
};
