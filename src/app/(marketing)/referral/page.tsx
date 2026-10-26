import { CheckCircle2, Mail, MessageCircle } from "lucide-react";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buttonVariants,
  Card,
  CardContent,
  Container,
  Section,
} from "@/components/ui";
import { siteConfig } from "@/config";
import { mailtoLink, whatsAppLink } from "@/lib/contact";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Refer a client",
  description:
    "Refer a child or adult to TheraViva for occupational therapy, speech and language therapy or audiology assessment in Delhi.",
  path: "/referral",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Refer a client", path: "/referral" },
];

const detailsToInclude = [
  "Your name, role and organisation",
  "Client's name and age (with consent to share their details)",
  "Main concerns and any relevant history",
  "Reports or assessments you already have",
  "What you'd like us to focus on",
  "Whether the family prefers clinic, home or online",
];

const referralEmailBody = `Referral to TheraViva
------------------------------

Referrer name:
Role / organisation:
Contact:

Client name:
Client age:
Main concerns:

Relevant history / reports attached:

Preferred format (clinic / home / online):

Consent to share details: yes/no
`;

export default function ReferralPage() {
  return (
    <>
      <Section spacing="lg">
        <Container size="md" className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="For professionals"
              title="Refer a client"
              description="We work with paediatricians, schools, NGOs and other clinicians. Referrals are welcomed and we'll keep you updated on the plan, with the family's consent."
            />
          </div>

          <Card>
            <CardContent className="space-y-5 pt-6">
              <h2 className="font-display text-xl font-semibold">
                What to include
              </h2>
              <ul className="space-y-2.5">
                {detailsToInclude.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  href={mailtoLink("Referral to TheraViva", referralEmailBody)}
                  className={buttonVariants({})}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Send a referral by email
                </a>
                <a
                  href={whatsAppLink(
                    "Hello TheraViva, I'd like to make a referral.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp us
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Please only share a client&apos;s details with their consent (or a
              guardian&apos;s consent, for a child). This website does not store
              any referral information — the email or message goes straight to the
              practice.
            </p>
            <p>
              For urgent or emergency concerns, please direct the family to local
              emergency services rather than this practice.
            </p>
            <p className="text-foreground">
              Direct contact:{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
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
