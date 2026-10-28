import { Breadcrumbs, CtaBand, FaqSection, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui";
import { faqs } from "@/data";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently asked questions",
  description:
    "Answers about booking, online and home visits, session length, fees and privacy at TheraViva in Delhi.",
  path: "/faq",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              as="h1"
              align="left"
              eyebrow="Questions"
              title="Frequently asked questions"
              description="If your question isn't answered here, message the practice on WhatsApp — there's no charge for asking."
            />
          </div>
          <FaqSection items={faqs} />
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>

      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faqs)]} />
    </>
  );
}
