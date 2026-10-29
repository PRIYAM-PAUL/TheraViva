import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned actions (buttons, filters). */
  actions?: React.ReactNode;
  className?: string;
}

/** Consistent title block for dashboard pages. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
