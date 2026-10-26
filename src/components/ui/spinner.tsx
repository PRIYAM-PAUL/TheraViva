import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  /** Accessible label. When omitted the spinner is decorative (aria-hidden). */
  label?: string;
}

/**
 * Indeterminate loading indicator.
 * Decorative by default; pass `label` when it is the only signal of progress.
 */
export function Spinner({ className, label, ...props }: SpinnerProps) {
  const decorative = !label;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role={decorative ? undefined : "status"}
      aria-hidden={decorative || undefined}
      aria-label={label}
      className={cn("size-4 animate-spin", className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
