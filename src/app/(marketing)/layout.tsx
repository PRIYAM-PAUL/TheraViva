import * as React from "react";

import { MarketingShell } from "@/components/layout";

/** Layout for public marketing pages: header, main landmark, and footer. */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
