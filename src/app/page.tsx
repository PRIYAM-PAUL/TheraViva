import {
  ConditionExplorer,
  CtaBand,
  FaqSection,
  Hero,
  PortfolioPreview,
  PricingPreview,
  ProcessSteps,
  SectionHeading,
  ServicesShowcase,
  StatsBand,
  TeamPreview,
  TestimonialWall,
  TrustBar,
} from "@/components/marketing";
import { MarketingShell } from "@/components/layout";
import { Container, Section } from "@/components/ui";

export default function HomePage() {
  return (
    <MarketingShell>
      <Hero />
      <TrustBar />

      <Section aria-labelledby="services-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="services-heading"
            eyebrow="What we do"
            title="Three disciplines, one joined-up plan"
            description="Occupational therapy, speech and language therapy, and audiology — so goals reinforce each other rather than pulling in different directions."
          />
          <ServicesShowcase />
        </Container>
      </Section>

      <StatsBand />

      <Section aria-labelledby="conditions-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="conditions-heading"
            eyebrow="What we support"
            title="Find the support that fits"
            description="Explore the conditions we work with. Each page explains what to look for and how therapy helps."
          />
          <ConditionExplorer />
        </Container>
      </Section>

      <Section
        aria-labelledby="process-heading"
        spacing="md"
        className="border-y border-border bg-surface-warm"
      >
        <Container className="space-y-10">
          <SectionHeading
            id="process-heading"
            eyebrow="How it works"
            title="Getting started is simple"
          />
          <ProcessSteps />
        </Container>
      </Section>

      <Section aria-labelledby="team-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="team-heading"
            eyebrow="Our team"
            title="The specialists you'll work with"
            description="A small team means you see the same therapist every time — no starting over."
          />
          <TeamPreview />
        </Container>
      </Section>

      <Section
        aria-labelledby="portfolio-heading"
        spacing="md"
        className="border-y border-border bg-surface-warm"
      >
        <Container className="space-y-10">
          <SectionHeading
            id="portfolio-heading"
            eyebrow="Portfolio"
            title="A look at our work"
            description="Sessions, sensory work, audiology and community outreach — shared with the consent of the families involved."
          />
          <PortfolioPreview />
        </Container>
      </Section>

      <Section aria-labelledby="reviews-heading" spacing="md">
        <Container className="space-y-10">
          <TestimonialWall />
        </Container>
      </Section>

      <Section
        aria-labelledby="pricing-heading"
        spacing="md"
        className="border-y border-border bg-surface-warm"
      >
        <Container className="space-y-10">
          <SectionHeading
            id="pricing-heading"
            eyebrow="Pricing"
            title="Clear, upfront fees"
            description="Session prices and packages, with no hidden costs."
          />
          <PricingPreview />
        </Container>
      </Section>

      <Section aria-labelledby="faq-heading" spacing="md">
        <Container className="space-y-10">
          <SectionHeading
            id="faq-heading"
            eyebrow="Questions"
            title="Frequently asked questions"
          />
          <FaqSection />
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>
    </MarketingShell>
  );
}
