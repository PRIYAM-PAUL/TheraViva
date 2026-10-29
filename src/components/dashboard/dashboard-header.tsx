"use client";

import {
  BarChart3,
  CalendarDays,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui";
import { siteConfig } from "@/config";
import { useAuth } from "@/features/dashboard/auth-context";
import { isAdminRole } from "@/features/dashboard/roles";
import type { UserRole } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

const PATIENT: UserRole[] = ["patient"];
const STAFF: UserRole[] = ["reception", "therapist", "admin"];
const BILLING: UserRole[] = ["reception", "admin"];
const ADMIN: UserRole[] = ["admin"];

const LINKS: NavLink[] = [
  // Patient area
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: PATIENT },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays, roles: PATIENT },
  { href: "/dashboard/prescriptions", label: "Prescriptions", icon: FileText, roles: PATIENT },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, roles: PATIENT },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle, roles: PATIENT },
  // Staff area
  { href: "/staff", label: "Staff home", icon: Stethoscope, roles: STAFF },
  { href: "/staff/appointments", label: "Appointments", icon: CalendarDays, roles: STAFF },
  { href: "/staff/intake", label: "Intake", icon: FileText, roles: BILLING },
  { href: "/staff/payments", label: "Payments", icon: Receipt, roles: BILLING },
  { href: "/staff/patients", label: "Patients", icon: Users, roles: STAFF },
  { href: "/staff/messages", label: "Inbox", icon: MessageSquare, roles: STAFF },
  { href: "/staff/analytics", label: "Analytics", icon: BarChart3, roles: ADMIN },
  { href: "/staff/users", label: "Team", icon: ShieldCheck, roles: ADMIN },
  { href: "/admin", label: "Admin overview", icon: LayoutDashboard, roles: ADMIN },
];

/** Top navigation for the authenticated area, scoped to the signed-in role. */
export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const links = user ? LINKS.filter((link) => link.roles.includes(user.role)) : [];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="shrink-0 font-display text-lg font-semibold tracking-tight"
          >
            {siteConfig.name}
          </Link>
          {user ? (
            <nav
              aria-label="Dashboard"
              className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>

        {user ? (
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name ?? user.email ?? user.phone}
              {isAdminRole(user.role) ? " · admin" : ""}
            </span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
