"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button, buttonVariants, Container, Section } from "@/components/ui";

/**
 * Route-level error boundary. Catches rendering/data errors in the route tree
 * below the root layout and offers a retry, without leaking error details.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for diagnostics; the UI stays generic.
    console.error(error);
  }, [error]);

  return (
    <Section spacing="lg">
      <Container size="md" className="flex flex-col items-center text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-prose text-pretty text-muted-foreground">
          This page couldn&apos;t load. Please try again — if it keeps happening,
          contact the practice directly and we&apos;ll help.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" onClick={reset}>
            <RotateCcw className="size-5" aria-hidden="true" />
            Try again
          </Button>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Contact the practice
          </Link>
        </div>
      </Container>
    </Section>
  );
}
