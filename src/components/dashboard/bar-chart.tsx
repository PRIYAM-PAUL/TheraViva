import { cn } from "@/lib/utils";

export interface BarChartPoint {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartPoint[];
  /** Formats the value shown in the accessible description / tooltip. */
  formatValue?: (value: number) => string;
  emptyLabel?: string;
  className?: string;
}

/**
 * A dependency-free bar chart.
 *
 * Rendered as a definition-style list so screen readers get the numbers, with a
 * decorative CSS bar behind each value. No canvas or chart library.
 */
export function BarChart({ data, formatValue, emptyLabel = "No data yet", className }: BarChartProps) {
  const format = formatValue ?? ((value: number) => String(value));
  const max = Math.max(1, ...data.map((point) => point.value));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {data.map((point) => {
        const width = Math.round((point.value / max) * 100);
        return (
          <li key={point.label} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 truncate text-muted-foreground" title={point.label}>
              {point.label}
            </span>
            <span
              className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${width}%` }}
              />
            </span>
            <span className="w-20 shrink-0 text-right tabular-nums text-foreground">
              {format(point.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
