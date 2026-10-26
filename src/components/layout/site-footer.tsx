import { Clock, HeartPulse, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui";
import { siteConfig } from "@/config";
import { telLink } from "@/lib/contact";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="mt-auto border-t border-border bg-surface-warm">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2.6fr]">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HeartPulse className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm text-pretty text-muted-foreground">
              {siteConfig.description}
            </p>

            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {contact.addressLines.join(", ")}
                  <br />
                  {contact.city}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={telLink()} className="transition-colors hover:text-foreground">
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all transition-colors hover:text-foreground"
                >
                  {contact.email}
                </a>
              </p>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {contact.hours.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
            </address>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {siteConfig.footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-display text-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-8 text-xs text-muted-foreground">
          <p className="max-w-3xl">
            <strong className="font-semibold text-foreground">
              Medical disclaimer:
            </strong>{" "}
            The information on this website is for general education and is not a
            diagnosis or a substitute for individual assessment by a qualified
            professional. This practice does not provide emergency care. If you
            or someone else is in immediate danger, contact local emergency
            services.
          </p>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {siteConfig.name}
              {contact.gstin ? ` · GSTIN ${contact.gstin}` : ""}
            </p>
            <p>
              This site does not process payments or store your health
              information.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
