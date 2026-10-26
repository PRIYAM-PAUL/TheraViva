import * as React from "react";

import { MarketingShell } from "@/components/layout";

/** Layout for the appointment-request flow. */
export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
