import * as React from "react";

import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Container,
  Prose,
  Section,
} from "@/components/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface LegalPageProps {
  title: string;
  path: string;
  /** Human-readable date, e.g. "October 2026". */
  updated: string;
  children: React.ReactNode;
}

/**
 * Shared shell for legal/policy pages. Includes a clear notice that the text is
 * a starting template that must be reviewed by the practice (and, ideally, a
 * lawyer) before launch.
 */
export function LegalPage({ title, path, updated, children }: LegalPageProps) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container size="md" className="space-y-6">
          <Breadcrumbs items={crumbs} />
          <header className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
          </header>

          <Alert variant="warning">
            <AlertTitle>Template content</AlertTitle>
            <AlertDescription>
              This policy is a starting point and must be reviewed and finalised
              by the practice before launch. It is not legal advice.
            </AlertDescription>
          </Alert>

          <Prose>{children}</Prose>
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
