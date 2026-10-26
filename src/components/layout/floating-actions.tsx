"use client";

import { CalendarPlus, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config";
import { trackContact } from "@/lib/analytics";
import { telLink, whatsAppLink } from "@/lib/contact";

/**
 * Sticky action bar for small screens: call, WhatsApp and book.
 * Hidden from large screens, where the header carries these actions.
 */
export function FloatingActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <nav
        aria-label="Quick actions"
        className="grid grid-cols-3 divide-x divide-border"
      >
        <a
          href={telLink()}
          onClick={() => trackContact("phone")}
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Phone className="size-5 text-primary" aria-hidden="true" />
          Call
        </a>
        <a
          href={whatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact("whatsapp")}
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle className="size-5 text-primary" aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          href="/book"
          className="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-primary"
        >
          <CalendarPlus className="size-5" aria-hidden="true" />
          Book
        </Link>
      </nav>
      <p className="sr-only">
        Call or message {siteConfig.name} on {siteConfig.contact.phone}.
      </p>
    </div>
  );
}
