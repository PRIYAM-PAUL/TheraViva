"use client";

import { HeartPulse, Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { TopBar } from "@/components/layout/top-bar";
import { ThemeSwitcher } from "@/components/theme";
import { Button, buttonVariants, Container } from "@/components/ui";
import { siteConfig } from "@/config";
import { trackContact } from "@/lib/analytics";
import { telLink, whatsAppLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const closeMenu = React.useCallback(() => setOpen(false), []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight">
                {siteConfig.name}
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                Occupational &amp; Speech Therapy · Delhi
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {siteConfig.primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeSwitcher />
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign in
            </Link>
            <a
              href={whatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact("whatsapp")}
              aria-label="Message us on WhatsApp"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </a>
            <Link href="/book" className={buttonVariants({ size: "sm" })}>
              Book an appointment
            </Link>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls={open ? "mobile-nav" : undefined}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </Container>

        {open ? (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-t border-border bg-background lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {siteConfig.primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-3 py-1.5">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>
                <ThemeSwitcher />
              </div>
              <div className="mt-1 flex flex-col gap-2">
                <Link
                  href="/book"
                  onClick={closeMenu}
                  className={buttonVariants({ size: "md" })}
                >
                  Book an appointment
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={buttonVariants({ variant: "outline", size: "md" })}
                >
                  Sign in
                </Link>
                <a
                  href={whatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackContact("whatsapp");
                    closeMenu();
                  }}
                  className={buttonVariants({ variant: "outline", size: "md" })}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp us
                </a>
                <a
                  href={telLink()}
                  onClick={() => {
                    trackContact("phone");
                    closeMenu();
                  }}
                  className="mt-1 text-center text-sm text-muted-foreground"
                >
                  or call {siteConfig.contact.phone}
                </a>
              </div>
            </Container>
          </nav>
        ) : null}
      </header>
    </>
  );
}
