import { Check } from "lucide-react";
import Link from "next/link";

import { buttonVariants, Card, CardContent } from "@/components/ui";
import { packages } from "@/data";
import { formatRupees } from "@/lib/format";

/** Package bundles, shown on the homepage pricing section. */
export function PricingPreview() {
  return (
    <div className="space-y-6">
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
              <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                {pack.featured ? (
                  <span className="w-fit rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Most popular
                  </span>
                ) : null}
                <h3 className="font-display text-lg font-semibold">{pack.name}</h3>
                <p className="font-display text-3xl font-semibold tracking-tight text-primary">
                  {formatRupees(pack.amountInr)}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-primary" aria-hidden="true" />
                  {pack.sessions} sessions
                </p>
                <p className="text-sm text-pretty text-muted-foreground">
                  {pack.description}
                </p>
                <Link
                  href="/book"
                  className={`${buttonVariants({ variant: pack.featured ? "primary" : "outline" })} mt-auto`}
                >
                  Request this
                </Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <p className="text-center text-xs text-muted-foreground">
        Indicative pricing — confirmed by the practice when your appointment is
        scheduled.{" "}
        <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
          See all prices
        </Link>
      </p>
    </div>
  );
}
