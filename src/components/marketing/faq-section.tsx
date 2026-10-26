import { ChevronDown } from "lucide-react";

import { faqs as defaultFaqs } from "@/data";
import type { FaqItem } from "@/types";

export interface FaqSectionProps {
  items?: FaqItem[];
  className?: string;
}

/** Disclosure list of questions. Uses native `<details>` for accessibility. */
export function FaqSection({ items = defaultFaqs, className }: FaqSectionProps) {
  return (
    <div
      className={
        className ??
        "mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
      }
    >
      {items.map((item) => (
        <details key={item.question} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
