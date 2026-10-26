import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  Container,
  Section,
} from "@/components/ui";
import { MODE_LABELS } from "@/config/appointment";
import { disciplines, services } from "@/data";
import { formatServicePrice } from "@/features/appointments/pricing";
import { formatDuration } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Occupational therapy, speech and language therapy, and audiology services in Delhi — assessments, therapy programmes, hearing assessment and hearing-aid fitting.",
  path: "/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-12">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Services"
              title="Therapy and assessment services"
              description="Every service starts with an assessment, so goals are based on what we actually find. Choose a discipline to see what's involved."
            />
          </div>

          <ul className="grid gap-5 lg:grid-cols-3">
            {disciplines.map((discipline) => {
              const Icon = discipline.icon;
              const count = services.filter(
                (service) => service.discipline === discipline.id,
              ).length;
              return (
                <li key={discipline.id}>
                  <Card className="flex h-full flex-col transition-shadow hover:shadow-lifted">
                    <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h2 className="font-display text-xl font-semibold tracking-tight">
                        {discipline.title}
                      </h2>
                      <p className="text-sm text-pretty text-muted-foreground">
                        {discipline.tagline}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {count} services
                      </p>
                      <Link
                        href={`/services/${discipline.id}`}
                        className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        View {discipline.short}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {disciplines.map((discipline) => (
        <Section
          key={discipline.id}
          aria-labelledby={`services-${discipline.id}`}
          spacing="md"
          className="border-t border-border"
        >
          <Container className="space-y-8">
            <SectionHeading
              id={`services-${discipline.id}`}
              align="left"
              eyebrow={discipline.short}
              title={discipline.title}
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.discipline === discipline.id)
                .map((service) => (
                  <li key={service.id}>
                    <Card className="flex h-full flex-col">
                      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                        <h3 className="font-medium text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-sm text-pretty text-muted-foreground">
                          {service.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="size-3" aria-hidden="true" />
                            {formatDuration(service.durationMinutes)}
                          </Badge>
                          {service.modes.map((mode) => (
                            <Badge key={mode} variant="neutral">
                              {MODE_LABELS[mode]}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                          <span className="text-sm font-semibold text-foreground">
                            {formatServicePrice(service)}
                          </span>
                          <Link
                            href="/book"
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                          >
                            Request
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </Container>
        </Section>
      ))}

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
