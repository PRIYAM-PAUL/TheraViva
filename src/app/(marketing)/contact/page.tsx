import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  buttonVariants,
  Card,
  CardContent,
  Container,
  Section,
} from "@/components/ui";
import { siteConfig } from "@/config";
import { primaryLocation } from "@/data";
import { mailtoLink, telLink, whatsAppLink } from "@/lib/contact";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact TheraViva in Delhi — WhatsApp, phone, email, clinic hours and directions.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              as="h1"
              align="left"
              eyebrow="Contact"
              title="Talk to us"
              description="Questions about therapy, booking or fees? Message or call and we'll help — there's no charge for asking."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col gap-3 pt-6">
                <MessageCircle className="size-6 text-primary" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold">WhatsApp</h2>
                <p className="text-sm text-muted-foreground">
                  The quickest way to reach us. Usually answered within a working
                  day.
                </p>
                <a
                  href={whatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonVariants({ size: "sm" })} mt-auto w-fit`}
                >
                  Message us
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-3 pt-6">
                <Phone className="size-6 text-primary" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold">Phone</h2>
                <p className="text-sm text-muted-foreground">
                  Prefer to talk it through? Call during clinic hours.
                </p>
                <a
                  href={telLink()}
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-auto w-fit`}
                >
                  {contact.phone}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-3 pt-6">
                <Mail className="size-6 text-primary" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold">Email</h2>
                <p className="text-sm text-muted-foreground">
                  Best for referrals, documents and detailed enquiries.
                </p>
                <a
                  href={mailtoLink("Enquiry from the website", "Hello TheraViva,\n\n")}
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-auto w-fit break-all`}
                >
                  {contact.email}
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <MapPin className="size-5 text-primary" aria-hidden="true" />
                  Clinic
                </h2>
                <address className="space-y-1 text-sm not-italic text-muted-foreground">
                  {contact.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>{contact.city}</p>
                </address>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryLocation.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Get directions
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Clock className="size-5 text-primary" aria-hidden="true" />
                  Opening hours
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {contact.hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <Link
                  href="/referral"
                  className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Referring a client? →
                </Link>
              </CardContent>
            </Card>
          </div>

          <Alert variant="info">
            <AlertTitle>This site cannot take bookings or payments directly</AlertTitle>
            <AlertDescription>
              Messages go straight to the practice — nothing is stored on this
              website. To request an appointment with your details, use the{" "}
              <Link href="/book" className="font-medium text-primary underline-offset-4 hover:underline">
                appointment request form
              </Link>
              .
            </AlertDescription>
          </Alert>
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
