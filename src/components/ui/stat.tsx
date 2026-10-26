import { cn } from "@/lib/utils";

export interface StatProps {
  value: string;
  label: string;
  className?: string;
}

/** A single figure with a caption, used in stat bands. */
export function Stat({ value, label, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
