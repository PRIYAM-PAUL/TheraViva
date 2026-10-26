import { Check } from "lucide-react";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  Container,
  Section,
} from "@/components/ui";
import { MODE_LABELS } from "@/config/appointment";
import { disciplines, packages, pricingDisclaimer, pricingNotes, services } from "@/data";
import { formatCurrency, formatDuration } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Transparent session fees for occupational therapy, speech and language therapy and audiology at TheraViva in Delhi.",
  path: "/pricing",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
];

export default function PricingPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-12">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Pricing"
              title="Clear fees, before you commit"
              description="Session prices by service and format. The practice confirms the final amount when your appointment is scheduled."
            />
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pricingNotes.map((note) => (
              <li key={note.title}>
                <Card className="h-full">
                  <CardContent className="space-y-2 pt-6">
                    <p className="flex items-start gap-2 font-medium text-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      {note.title}
                    </p>
                    <p className="text-sm text-pretty text-muted-foreground">
                      {note.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          {disciplines.map((discipline) => (
            <div key={discipline.id} className="space-y-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {discipline.title}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {discipline.title} session prices
                  </caption>
                  <thead className="bg-surface-warm text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Service
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Duration
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {services
                      .filter((service) => service.discipline === discipline.id)
                      .map((service) => (
                        <tr key={service.id} className="bg-card">
                          <th scope="row" className="px-4 py-4 font-normal">
                            <span className="font-medium text-foreground">
                              {service.title}
                            </span>
                            {service.priceNote ? (
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {service.priceNote}
                              </span>
                            ) : null}
                          </th>
                          <td className="px-4 py-4 text-muted-foreground">
                            {formatDuration(service.durationMinutes)}
                          </td>
                          <td className="px-4 py-4">
                            <ul className="space-y-1">
                              {service.prices.map((price) => (
                                <li key={price.mode} className="flex flex-wrap gap-x-2">
                                  <span className="text-muted-foreground">
                                    {MODE_LABELS[price.mode]}:
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {price.amountInr === 0
                                      ? "No charge"
                                      : formatCurrency(price.amountInr * 100)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="space-y-6">
            <SectionHeading
              align="left"
              eyebrow="Packages"
              title="Session bundles"
              description="Blocks of sessions for families starting a therapy programme."
            />
            <ul className="grid gap-5 lg:grid-cols-3">
              {packages.map((pack) => (
                <li key={pack.id}>
                  <Card
                    className={
                      pack.featured
                        ? "flex h-full flex-col border-primary/60 shadow-glow"
                        : "flex h-full flex-col"
                    }
                  >
                    <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                      <h3 className="font-display text-lg font-semibold">
                        {pack.name}
                      </h3>
                      <p className="font-display text-3xl font-semibold tracking-tight text-primary">
                        {formatCurrency(pack.amountInr * 100)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pack.sessions} sessions
                      </p>
                      <p className="text-sm text-pretty text-muted-foreground">
                        {pack.description}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <Alert variant="info">
            <AlertTitle>About these prices</AlertTitle>
            <AlertDescription>{pricingDisclaimer}</AlertDescription>
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
