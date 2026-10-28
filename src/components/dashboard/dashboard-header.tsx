"use client";

import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui";
import { siteConfig } from "@/config";
import { useAuth } from "@/features/dashboard/auth-context";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "My dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin", label: "Practice admin", icon: ShieldCheck, adminOnly: true },
];

/** Top navigation for the authenticated area. */
export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          {user ? (
            <nav aria-label="Dashboard" className="flex items-center gap-1">
              {LINKS.filter((link) => !link.adminOnly || user.role === "admin").map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name ?? user.email ?? user.phone}
              {user.role === "admin" ? " · admin" : ""}
            </span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
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
