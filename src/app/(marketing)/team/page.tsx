import { ArrowRight, Languages } from "lucide-react";
import Link from "next/link";

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
import { getDiscipline, professionals } from "@/data";
import { breadcrumbJsonLd, buildMetadata, physicianJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our team",
  description:
    "Meet the TheraViva team — a Master's-qualified occupational therapist and a speech and language therapist and audiologist based in Delhi.",
  path: "/team",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
];

export default function TeamPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-12">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              as="h1"
              align="left"
              eyebrow="Our team"
              title="The specialists you'll work with"
              description="A small practice by design. You see the same specialist each time, so nothing gets lost between appointments."
            />
          </div>

          <ul className="space-y-6">
            {professionals.map((professional) => (
              <li key={professional.id}>
                <Card className="overflow-hidden">
                  <CardContent className="grid gap-6 pt-6 lg:grid-cols-[auto_1fr]">
                    <MediaPlaceholder
                      label={professional.name}
                      discipline={professional.disciplines[0]}
                      aspect="portrait"
                      className="w-full lg:w-56"
                    />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="font-display text-2xl font-semibold tracking-tight">
                          {professional.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {professional.headline}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {professional.disciplines.map((discipline) => (
                            <Badge key={discipline} variant="primary">
                              {getDiscipline(discipline)?.short ?? discipline}
                            </Badge>
                          ))}
                          <Badge variant="neutral" className="gap-1">
                            <Languages className="size-3" aria-hidden="true" />
                            {professional.languages.join(", ")}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-pretty text-muted-foreground">
                        {professional.bio[0]}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/team/${professional.slug}`}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                          Full profile
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                        <Link href="/book" className={buttonVariants({ size: "sm" })}>
                          Book with {professional.name.split(" ")[0]}
                        </Link>
                      </div>
                    </div>
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

      <JsonLd
        data={[breadcrumbJsonLd(crumbs), ...professionals.map(physicianJsonLd)]}
      />
    </>
  );
}
