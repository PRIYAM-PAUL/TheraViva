import { Breadcrumbs, CtaBand, PortfolioExplorer, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Photographs and videos from occupational therapy, speech and language therapy, audiology and community outreach sessions — shared with consent.",
  path: "/portfolio",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
];

export default function PortfolioPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Portfolio"
              title="Our work, in pictures"
              description="Real sessions across paediatric therapy, sensory integration, speech and language, audiology and community outreach. Choose a specialist to see their work."
            />
          </div>

          <PortfolioExplorer />
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
