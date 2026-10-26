import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Typographic wrapper for long-form content (blog articles).
 * Applies comfortable reading styles to child elements without needing the
 * typography plugin.
 */
export function Prose({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-none text-pretty leading-relaxed text-foreground/90",
        "[&_p]:mt-4 [&_p]:first:mt-0",
        "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
