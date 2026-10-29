"use client";

import {
  BarChart3,
  CalendarDays,
  FileText,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { AuthGuard, PageHeader } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";
import { roleLabel } from "@/features/dashboard/roles";
import type { UserRole } from "@/features/dashboard/types";

interface Tile {
  href: string;
  label: string;
  description: string;
  icon: typeof CalendarDays;
  roles: UserRole[];
}

const BILLING: UserRole[] = ["reception", "admin"];
const STAFF: UserRole[] = ["reception", "therapist", "admin"];
const ADMIN: UserRole[] = ["admin"];

const TILES: Tile[] = [
  {
    href: "/staff/appointments",
    label: "Appointments",
    description: "Today's schedule, confirmations and status changes.",
    icon: CalendarDays,
    roles: STAFF,
  },
  {
    href: "/staff/intake",
    label: "Intake",
    description: "Appointment requests, enquiries and referrals to triage.",
    icon: FileText,
    roles: BILLING,
  },
  {
    href: "/staff/payments",
    label: "Payments",
    description: "Invoices, payments, refunds and online checkout.",
    icon: Receipt,
    roles: BILLING,
  },
  {
    href: "/staff/patients",
    label: "Patients",
    description: "Everyone registered with the practice.",
    icon: Users,
    roles: STAFF,
  },
  {
    href: "/staff/messages",
    label: "Inbox",
    description: "Patient conversations awaiting a reply.",
    icon: MessageSquare,
    roles: STAFF,
  },
  {
    href: "/staff/analytics",
    label: "Analytics",
    description: "KPIs, revenue, engagement and the Grafana board.",
    icon: BarChart3,
    roles: ADMIN,
  },
  {
    href: "/staff/users",
    label: "Team",
    description: "Create and manage staff accounts and roles.",
    icon: ShieldCheck,
    roles: ADMIN,
  },
];

function StaffHome() {
  const { user } = useAuth();
  const role = user?.role ?? "reception";
  const tiles = TILES.filter((tile) => tile.roles.includes(role));

  return (
    <div className="space-y-8">
      <PageHeader
        title={user?.name ? `Welcome, ${user.name}` : "Staff home"}
        description={`You are signed in as ${roleLabel(role)}. Choose a workspace below.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.href} href={tile.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-accent/40">
                <CardContent className="space-y-2 pt-6">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-lg font-semibold tracking-tight">
                    {tile.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">{tile.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function StaffHomePage() {
  return (
    <AuthGuard requireRoles={STAFF}>
      <StaffHome />
    </AuthGuard>
  );
}
