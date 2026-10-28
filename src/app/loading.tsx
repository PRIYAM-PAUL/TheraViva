import { Container } from "@/components/ui";

/** Route-level loading UI shown while a segment streams in. */
export default function Loading() {
  return (
    <Container
      className="flex min-h-[50vh] items-center justify-center py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-border border-t-primary"
      />
    </Container>
  );
}
