import { CalendarCheck, Clock, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { RequestForm } from "@/components/appointment";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui";
import { siteConfig } from "@/config";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { telLink, whatsAppLink } from "@/lib/contact";

export const metadata: Metadata = buildMetadata({
  title: "Book an appointment",
  description:
    "Request an occupational therapy, speech and language, or audiology appointment with TheraViva in Delhi — in clinic, at home or online.",
  path: "/book",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Book an appointment", path: "/book" },
];

export default function BookPage() {
  return (
    <>
      <Section spacing="md">
        <Container size="md">
          <Breadcrumbs items={crumbs} />

          <div className="mt-6 space-y-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Request an appointment
            </h1>
            <p className="max-w-prose text-pretty text-muted-foreground">
              Tell us what you need and when suits you. The practice will reply to
              confirm a time — usually within a working day.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              Takes about two minutes
            </li>
            <li className="flex items-center gap-2">
              <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
              No payment required
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" aria-hidden="true" />
              Sent straight to the practice
            </li>
          </ul>

          <div className="mt-8">
            <RequestForm />
          </div>

          <div className="mt-8 rounded-xl border border-border bg-surface-warm p-5">
            <p className="text-sm font-medium text-foreground">
              Prefer to talk first?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Message or call the practice directly and we&apos;ll answer your
              questions before you commit to anything.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <a
                href={whatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                WhatsApp {siteConfig.contact.phone}
              </a>
              <a
                href={telLink()}
                className="flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
              >
                <Phone className="size-4" aria-hidden="true" />
                Call the clinic
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
