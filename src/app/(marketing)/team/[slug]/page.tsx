import { Award, GraduationCap, Mail, MessageCircle, Phone } from "lucide-react";
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
  MediaGallery,
  MediaPlaceholder,
  Section,
} from "@/components/ui";
import {
  getConditionBySlug,
  getDiscipline,
  getProfessionalBySlug,
  getServiceBySlug,
  mediaAssets,
  professionals,
} from "@/data";
import { mailtoLink, telLink, whatsAppLink } from "@/lib/contact";
import { breadcrumbJsonLd, buildMetadata, physicianJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return professionals.map((professional) => ({ slug: professional.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);
  if (!professional)
    return buildMetadata({
      title: "Not found",
      description: "",
      path: "/team",
      noIndex: true,
    });

  return buildMetadata({
    title: `${professional.name} — ${professional.headline}`,
    description: professional.summary,
    path: `/team/${professional.slug}`,
  });
}

export default async function ProfessionalPage({
  params,
}: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);
  if (!professional) notFound();

  const gallery = mediaAssets.filter(
    (asset) => asset.professionalId === professional.id,
  );
  const conditions = professional.conditions
    .map((conditionSlug) => getConditionBySlug(conditionSlug))
    .filter((condition) => condition !== undefined);

  const services = Array.from(
    new Set(
      conditions.flatMap((condition) => condition.services),
    ),
  )
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service) => service !== undefined);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Team", path: "/team" },
    { name: professional.name, path: `/team/${professional.slug}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-14">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />

            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <MediaPlaceholder
                label={professional.name}
                discipline={professional.disciplines[0]}
                aspect="portrait"
                className="w-full"
              />

              <div className="space-y-5">
                <div className="space-y-2">
                  <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {professional.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {professional.headline}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {professional.disciplines.map((discipline) => (
                      <Badge key={discipline} variant="primary">
                        {getDiscipline(discipline)?.short ?? discipline}
                      </Badge>
                    ))}
                    <Badge variant="neutral">
                      {professional.yearsExperience}+ years experience
                    </Badge>
                    <Badge variant="neutral">
                      {professional.languages.join(" · ")}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/book" className={buttonVariants({})}>
                    Request an appointment
                  </Link>
                  <a
                    href={whatsAppLink(
                      `Hello, I'd like to ask about an appointment with ${professional.name}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <a
                    href={telLink(professional.phone)}
                    className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <Phone className="size-4 text-primary" aria-hidden="true" />
                    {professional.phone}
                  </a>
                  <a
                    href={mailtoLink(
                      `Appointment enquiry — ${professional.name}`,
                      `Hello ${professional.name},\n\n`,
                      professional.email,
                    )}
                    className="flex items-center gap-1.5 break-all transition-colors hover:text-foreground"
                  >
                    <Mail className="size-4 text-primary" aria-hidden="true" />
                    {professional.email}
                  </a>
                </div>

                {professional.registrations.length > 0 ? (
                  <div className="space-y-1.5 rounded-xl border border-border bg-surface-warm p-4">
                    {professional.registrations.map((registration) => (
                      <p key={registration.label} className="text-sm">
                        <span className="text-muted-foreground">
                          {registration.label}:
                        </span>{" "}
                        <span className="font-medium text-foreground">
                          {registration.value}
                        </span>
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  About {professional.name.split(" ")[0]}
                </h2>
                {professional.bio.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-pretty leading-relaxed text-foreground/90"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="space-y-5">
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Experience
                </h2>
                <ol className="space-y-6 border-l border-border pl-6">
                  {professional.experience.map((entry) => (
                    <li key={`${entry.organisation}-${entry.role}`} className="relative">
                      <span
                        className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                        aria-hidden="true"
                      />
                      <p className="font-medium text-foreground">{entry.role}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.organisation}
                        {entry.location ? ` · ${entry.location}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.period}</p>
                      {entry.points.length > 0 ? (
                        <ul className="mt-2 space-y-1.5">
                          {entry.points.map((point) => (
                            <li
                              key={point}
                              className="text-sm text-pretty text-muted-foreground"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>

              {professional.volunteering.length > 0 ? (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    Volunteering
                  </h2>
                  <ol className="space-y-6 border-l border-border pl-6">
                    {professional.volunteering.map((entry) => (
                      <li
                        key={`${entry.organisation}-${entry.role}`}
                        className="relative"
                      >
                        <span
                          className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-amber-500"
                          aria-hidden="true"
                        />
                        <p className="font-medium text-foreground">{entry.role}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.organisation}
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.period}</p>
                        <ul className="mt-2 space-y-1.5">
                          {entry.points.map((point) => (
                            <li
                              key={point}
                              className="text-sm text-pretty text-muted-foreground"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {gallery.length > 0 ? (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {professional.name.split(" ")[0]}&apos;s work
                  </h2>
                  <MediaGallery assets={gallery} />
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <GraduationCap className="size-5 text-primary" aria-hidden="true" />
                    Qualifications
                  </h2>
                  <ul className="space-y-3">
                    {professional.credentials.map((credential) => (
                      <li key={credential.title} className="text-sm">
                        <p className="font-medium text-foreground">
                          {credential.title}
                        </p>
                        <p className="text-muted-foreground">
                          {[credential.institution, credential.period]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <Award className="size-5 text-primary" aria-hidden="true" />
                    Skills
                  </h2>
                  <ul className="flex flex-wrap gap-1.5">
                    {professional.skills.map((skill) => (
                      <li key={skill}>
                        <Badge variant="neutral">{skill}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {conditions.length > 0 ? (
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <h2 className="font-display text-lg font-semibold">
                      Conditions treated
                    </h2>
                    <ul className="flex flex-wrap gap-1.5">
                      {conditions.map((condition) => (
                        <li key={condition.slug}>
                          <Link
                            href={`/conditions/${condition.slug}`}
                            className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                          >
                            {condition.shortTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}
            </aside>
          </div>

          {services.length > 0 ? (
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Services"
                title={`Sessions with ${professional.name.split(" ")[0]}`}
              />
              <ul className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href="/book"
                      className="inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand
            context={`an appointment with ${professional.name}`}
            title={`Work with ${professional.name}?`}
          />
        </Container>
      </Section>

      <JsonLd
        data={[breadcrumbJsonLd(crumbs), physicianJsonLd(professional)]}
      />
    </>
  );
}
