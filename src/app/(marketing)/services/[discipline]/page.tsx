import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  Container,
  MediaPlaceholder,
  Section,
} from "@/components/ui";
import { MODE_LABELS } from "@/config/appointment";
import {
  disciplines,
  getConditionsByDiscipline,
  getDiscipline,
  getServicesByDiscipline,
  getProfessionalById,
} from "@/data";
import { formatServicePrice } from "@/features/appointments/pricing";
import { formatDuration } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return disciplines.map((discipline) => ({ discipline: discipline.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[discipline]">) {
  const { discipline: slug } = await params;
  const discipline = getDiscipline(slug);
  if (!discipline)
    return buildMetadata({
      title: "Not found",
      description: "",
      path: "/services",
      noIndex: true,
    });

  return buildMetadata({
    title: discipline.title,
    description: `${discipline.tagline} ${discipline.description[0]}`,
    path: `/services/${discipline.id}`,
  });
}

export default async function DisciplinePage({
  params,
}: PageProps<"/services/[discipline]">) {
  const { discipline: slug } = await params;
  const discipline = getDiscipline(slug);
  if (!discipline) notFound();

  const disciplineServices = getServicesByDiscipline(discipline.id);
  const relatedConditions = getConditionsByDiscipline(discipline.id);
  const team = discipline.professionalIds
    .map((id) => getProfessionalById(id))
    .filter((professional) => professional !== undefined);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: discipline.short, path: `/services/${discipline.id}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-12">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <SectionHeading
                  as="h1"
                  align="left"
                  eyebrow="Service"
                  title={discipline.title}
                  description={discipline.tagline}
                />
                {discipline.description.map((paragraph) => (
                  <p key={paragraph} className="text-pretty text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              <MediaPlaceholder
                label={`${discipline.title} session`}
                discipline={discipline.id}
                aspect="wide"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              What&apos;s included
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {disciplineServices.map((service) => (
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
          </div>

          {relatedConditions.length > 0 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Conditions we support
              </h2>
              <ul className="flex flex-wrap gap-2">
                {relatedConditions.map((condition) => (
                  <li key={condition.slug}>
                    <Link
                      href={`/conditions/${condition.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                    >
                      {condition.shortTitle}
                      <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {team.length > 0 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Who you&apos;ll see
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {team.map((professional) => (
                  <li key={professional.id}>
                    <Card>
                      <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                        <MediaPlaceholder
                          label={professional.name}
                          discipline={discipline.id}
                          aspect="square"
                          className="w-20"
                        />
                        <div className="space-y-1.5">
                          <p className="font-medium text-foreground">
                            {professional.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {professional.headline}
                          </p>
                          <Link
                            href={`/team/${professional.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                          >
                            View profile
                            <ArrowRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand context={discipline.title} />
        </Container>
      </Section>

      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          ...disciplineServices.map((service) => serviceJsonLd(service)),
        ]}
      />
    </>
  );
}
