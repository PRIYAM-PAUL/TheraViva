import Link from "next/link";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge, Card, CardContent, Container, Section } from "@/components/ui";
import { conditions, getDiscipline } from "@/data";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Conditions we support",
  description:
    "Occupational therapy, speech and language therapy and audiology support for cerebral palsy, autism, ADHD, sensory processing, speech delay, hearing loss and more.",
  path: "/conditions",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Conditions", path: "/conditions" },
];

const ageLabels = {
  child: "Children",
  adult: "Adults",
  all: "Children & adults",
} as const;

export default function ConditionsPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Conditions"
              title="Support for a wide range of needs"
              description="Every child and adult is different. These pages explain what to look for and how therapy helps — they are general information, not a diagnosis."
            />
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conditions.map((condition) => (
              <li key={condition.slug}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-lifted">
                  <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                    <div className="flex flex-wrap gap-1.5">
                      {condition.disciplines.map((discipline) => (
                        <Badge key={discipline} variant="primary">
                          {getDiscipline(discipline)?.short ?? discipline}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      <Link
                        href={`/conditions/${condition.slug}`}
                        className="underline-offset-4 hover:text-primary hover:underline"
                      >
                        {condition.shortTitle}
                      </Link>
                    </h2>
                    <p className="text-sm text-pretty text-muted-foreground">
                      {condition.summary}
                    </p>
                    <p className="mt-auto pt-1 text-xs text-muted-foreground">
                      {ageLabels[condition.ageGroup]}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
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
