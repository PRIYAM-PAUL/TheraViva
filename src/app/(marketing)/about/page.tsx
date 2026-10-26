import { Breadcrumbs, CtaBand, SectionHeading, TeamPreview, TrustBar } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { Card, CardContent, Container, Section } from "@/components/ui";
import { mission, trustSignals, valueProps } from "@/data";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "TheraViva is a small Delhi practice bringing together occupational therapy, speech and language therapy and audiology for children and adults.",
  path: "/about",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <Section spacing="lg">
        <Container size="md" className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow={mission.eyebrow}
              title={mission.title}
            />
            <div className="space-y-4">
              {mission.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-pretty leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <TrustBar />

      <Section aria-labelledby="values-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="values-heading"
            eyebrow="Our approach"
            title="What we care about"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((value) => {
              const Icon = value.icon;
              return (
                <li key={value.title}>
                  <Card className="h-full">
                    <CardContent className="flex flex-col gap-3 pt-6">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {value.title}
                      </h3>
                      <p className="text-sm text-pretty text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section
        aria-labelledby="credentials-heading"
        spacing="md"
        className="border-y border-border bg-surface-warm"
      >
        <Container className="space-y-10">
          <SectionHeading
            id="credentials-heading"
            eyebrow="Credentials"
            title="Clinical experience you can check"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal) => (
              <li key={signal.label} className="space-y-1.5">
                <p className="font-display text-lg font-semibold tracking-tight">
                  {signal.label}
                </p>
                <p className="text-sm text-muted-foreground">{signal.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="about-team-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="about-team-heading"
            eyebrow="Our team"
            title="Who you'll be working with"
          />
          <TeamPreview />
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
