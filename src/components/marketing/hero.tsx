import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react";
import Link from "next/link";

import { Badge, buttonVariants, Container, MediaPlaceholder } from "@/components/ui";
import { siteConfig } from "@/config";
import { whatsAppLink } from "@/lib/contact";

const highlights = [
  "Master's-qualified occupational therapy",
  "4+ years in speech & language therapy",
  "Clinic, home visits & online across Delhi NCR",
];

/** Above-the-fold hero. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-radial">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40"
      />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="space-y-7">
          <Badge variant="primary" className="gap-1.5">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Occupational therapy · Speech &amp; language · Audiology
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Therapy that helps people take part in everyday life
          </h1>

          <p className="max-w-prose text-lg text-pretty text-muted-foreground">
            A small Delhi practice for children and adults — assessment-led
            occupational therapy, speech and language therapy, and audiology.
            In clinic, at home, or online.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className={buttonVariants({ size: "lg" })}>
              Request an appointment
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <a
              href={whatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Free 15-min chat
            </a>
          </div>

          <ul className="space-y-2.5 pt-2">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <Star
                  className="mt-0.5 size-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <MediaPlaceholder
            label="A therapy session in progress"
            discipline="occupational-therapy"
            aspect="portrait"
            className="shadow-lifted"
          />

          <div className="absolute -left-3 top-8 hidden rounded-xl border border-border bg-card/95 p-3 shadow-soft backdrop-blur sm:block">
            <p className="text-xs font-semibold text-foreground">
              Assessment-led
            </p>
            <p className="text-xs text-muted-foreground">
              Clear goals, every time
            </p>
          </div>

          <div className="absolute -right-3 bottom-10 hidden rounded-xl border border-border bg-card/95 p-3 shadow-soft backdrop-blur sm:block">
            <p className="text-xs font-semibold text-foreground">
              Delhi NCR &amp; online
            </p>
            <p className="text-xs text-muted-foreground">
              {siteConfig.contact.phone}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
