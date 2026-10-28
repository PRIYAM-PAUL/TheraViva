import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Applied to the heading element, for `aria-labelledby`. */
  id?: string;
  className?: string;
  /**
   * Heading level to render. Defaults to `h2` (a section heading). Use `h1`
   * when this block is the page's primary title, so the document keeps a
   * top-level heading.
   */
  as?: "h1" | "h2" | "h3";
}

/** Consistent heading block used across marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "text-pretty text-muted-foreground",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
