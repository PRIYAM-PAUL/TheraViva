import { Clock, Phone } from "lucide-react";

import { Container } from "@/components/ui";
import { siteConfig } from "@/config";
import { telLink, whatsAppLink } from "@/lib/contact";

/**
 * Slim utility strip above the header: phone, WhatsApp and opening hours.
 * Hidden on small screens, where the sticky action bar takes over.
 */
export function TopBar() {
  return (
    <div className="hidden border-b border-border bg-surface-warm text-xs text-muted-foreground lg:block">
      <Container className="flex h-9 items-center justify-between gap-4">
        <p className="flex items-center gap-2">
          <Clock className="size-3.5 text-primary" aria-hidden="true" />
          {siteConfig.contact.hours[0]}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={telLink()}
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Phone className="size-3.5 text-primary" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
          <a
            href={whatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            WhatsApp us
          </a>
        </div>
      </Container>
    </div>
  );
}
