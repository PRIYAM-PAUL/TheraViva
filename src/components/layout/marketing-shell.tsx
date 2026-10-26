import * as React from "react";

import { FloatingActions } from "@/components/layout/floating-actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Chrome for the public site: header, main landmark, footer, and a sticky
 * mobile action bar. A bottom pad keeps the bar from covering content.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <FloatingActions />
    </div>
  );
}
