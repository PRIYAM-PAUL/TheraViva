import { Clock, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

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
import { getLocationBySlug, locations } from "@/data";
import { telLink, whatsAppLink } from "@/lib/contact";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locations.map((location) => ({ city: location.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/locations/[city]">) {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location)
    return buildMetadata({ title: "Not found", description: "", path: "/contact" });

  return buildMetadata({
    title: `Therapy in ${location.city}`,
    description: `Occupational therapy, speech and language therapy and audiology in ${location.city} — clinic appointments, home visits and online sessions.`,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({
  params,
}: PageProps<"/locations/[city]">) {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: location.city, path: `/locations/${location.slug}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Where we work"
              title={`Therapy in ${location.city}`}
              description={`Occupational therapy, speech and language therapy and audiology — available at the clinic, as home visits, and online.`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <MapPin className="size-5 text-primary" aria-hidden="true" />
                  Clinic
                </h2>
                <address className="space-y-1 text-sm not-italic text-muted-foreground">
                  {location.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    {location.city}, {location.state} {location.pincode}
                  </p>
                </address>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Get directions
                  </a>
                  <a
                    href={telLink(location.phone)}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    {location.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-5 pt-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Clock className="size-5 text-primary" aria-hidden="true" />
                  Opening hours
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {location.hours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <a
                  href={whatsAppLink(
                    `Hello, I'd like to ask about appointments in ${location.city}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "sm" })}
                >
                  Message on WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Areas we serve
            </h2>
            <ul className="flex flex-wrap gap-2">
              {location.serviceArea.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <Alert variant="warning">
            <AlertTitle>Clinic address is being confirmed</AlertTitle>
            <AlertDescription>
              The exact clinic address is still being finalised. Message the
              practice on WhatsApp and we&apos;ll send you the location and
              directions.
            </AlertDescription>
          </Alert>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand context={`an appointment in ${location.city}`} />
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
