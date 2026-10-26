import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical rhythm. Defaults to `md`. */
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingMap: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-10 sm:py-12",
  md: "py-14 sm:py-20",
  lg: "py-20 sm:py-28",
};

/** Semantic page section with consistent vertical rhythm. */
export function Section({
  className,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacingMap[spacing], className)} {...props} />
  );
}
