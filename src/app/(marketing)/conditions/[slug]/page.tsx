import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  CtaBand,
  FaqSection,
  SectionHeading,
} from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  buttonVariants,
  Card,
  CardContent,
  Container,
  MediaPlaceholder,
  Section,
} from "@/components/ui";
import {
  conditions,
  getConditionBySlug,
  getDiscipline,
  getProfessionalById,
  getServiceBySlug,
} from "@/data";
import { formatServicePrice } from "@/features/appointments/pricing";
import { breadcrumbJsonLd, buildMetadata, conditionJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return conditions.map((condition) => ({ slug: condition.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/conditions/[slug]">) {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition)
    return buildMetadata({ title: "Not found", description: "", path: "/conditions" });

  return buildMetadata({
    title: condition.title,
    description: condition.summary,
    path: `/conditions/${condition.slug}`,
  });
}

export default async function ConditionPage({
  params,
}: PageProps<"/conditions/[slug]">) {
  const { slug } = await params;
  const condition = getConditionBySlug(slug);
  if (!condition) notFound();

  const relatedServices = condition.services
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service) => service !== undefined);
  const team = condition.professionalIds
    .map((id) => getProfessionalById(id))
    .filter((professional) => professional !== undefined);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Conditions", path: "/conditions" },
    { name: condition.shortTitle, path: `/conditions/${condition.slug}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-12">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {condition.disciplines.map((discipline) => (
                    <Badge key={discipline} variant="primary">
                      {getDiscipline(discipline)?.short ?? discipline}
                    </Badge>
                  ))}
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {condition.title}
                </h1>
                <p className="text-lg text-pretty text-muted-foreground">
                  {condition.summary}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/book" className={buttonVariants({})}>
                    Request an assessment
                  </Link>
                  <Link
                    href="/team"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Meet the specialists
                  </Link>
                </div>
              </div>
              <MediaPlaceholder
                label={`${condition.shortTitle} therapy`}
                discipline={condition.disciplines[0]}
                aspect="wide"
              />
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div className="space-y-6">
              {condition.body.map((paragraph) => (
                <p key={paragraph} className="text-pretty leading-relaxed text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-6 rounded-2xl border border-border bg-surface-warm p-6">
              <h2 className="font-display text-lg font-semibold">
                Signs to look out for
              </h2>
              <ul className="space-y-2.5">
                {condition.signs.map((sign) => (
                  <li key={sign} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading
              align="left"
              eyebrow="Our approach"
              title="How we help"
            />
            <ol className="grid gap-4 sm:grid-cols-2">
              {condition.approach.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm text-pretty text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {relatedServices.length > 0 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Services that help
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedServices.map((service) => (
                  <li key={service.id}>
                    <Card className="flex h-full flex-col">
                      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                        <h3 className="font-medium text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-sm text-pretty text-muted-foreground">
                          {service.summary}
                        </p>
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
          ) : null}

          {team.length > 0 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Who can help
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {team.map((professional) => (
                  <li key={professional.id}>
                    <Card>
                      <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                        <MediaPlaceholder
                          label={professional.name}
                          discipline={professional.disciplines[0]}
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

          <Alert variant="warning">
            <AlertTitle>This page is general information, not a diagnosis</AlertTitle>
            <AlertDescription>
              Every person is different. If you are concerned about yourself or
              your child, an individual assessment is the only way to know what is
              going on and what will help.
            </AlertDescription>
          </Alert>
        </Container>
      </Section>

      {condition.faq.length > 0 ? (
        <Section
          aria-labelledby="condition-faq"
          spacing="md"
          className="border-t border-border"
        >
          <Container className="space-y-8">
            <SectionHeading
              id="condition-faq"
              eyebrow="Questions"
              title={`FAQs about ${condition.shortTitle}`}
            />
            <FaqSection items={condition.faq} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="md">
        <Container>
          <CtaBand context={condition.shortTitle} />
        </Container>
      </Section>

      <JsonLd data={[...conditionJsonLd(condition), breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
