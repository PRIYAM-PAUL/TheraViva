import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

/** A calm, honest empty state (used when a patient has no history yet). */
export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface-warm px-6 py-10 text-center">
      {Icon ? <Icon className="size-6 text-primary" aria-hidden="true" /> : null}
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
