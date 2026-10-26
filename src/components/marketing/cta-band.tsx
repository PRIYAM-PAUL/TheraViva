import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui";
import { whatsAppLink } from "@/lib/contact";

export interface CtaBandProps {
  title?: string;
  description?: string;
  /** Optional context appended to the WhatsApp message. */
  context?: string;
}

/** Closing call-to-action band. */
export function CtaBand({
  title = "Not sure where to start?",
  description = "Send a request or a quick WhatsApp message. We'll help you work out whether therapy is right for you — no charge, no obligation.",
  context,
}: CtaBandProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-warm-radial p-8 text-center shadow-soft sm:p-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
        {description}
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/book" className={buttonVariants({ size: "lg" })}>
          Request an appointment
        </Link>
        <a
          href={whatsAppLink(context)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <MessageCircle className="size-5" aria-hidden="true" />
          Message on WhatsApp
        </a>
      </div>
    </div>
  );
}
