import { Compass, Home } from "lucide-react";
import Link from "next/link";

import { buttonVariants, Container, Section } from "@/components/ui";

/** Rendered for any unmatched route (`notFound()` or a bad URL). */
export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container size="md" className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 max-w-prose text-pretty text-muted-foreground">
          The link may be out of date, or the page may have moved. You can head
          back home, or ask us directly and we&apos;ll point you the right way.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            <Home className="size-5" aria-hidden="true" />
            Back to home
          </Link>
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
