import { Container, Marquee } from "@/components/ui";
import { trustSignals } from "@/data";

/** Scrolling trust strip beneath the hero. */
export function TrustBar() {
  const items = trustSignals.map((signal) => signal.label);

  return (
    <div className="border-y border-border bg-surface-warm py-4">
      <Container>
        <div className="flex items-center gap-6">
          <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
            Trusted clinical experience
          </p>
          <Marquee items={items} className="flex-1" />
        </div>
      </Container>
    </div>
  );
}
