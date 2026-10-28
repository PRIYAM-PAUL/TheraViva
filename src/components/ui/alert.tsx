import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4 text-sm",
  {
    variants: {
      variant: {
        info: "border-border bg-muted/50 text-foreground",
        success: "border-success/30 bg-success/5 text-foreground",
        warning: "border-warning/30 bg-warning/5 text-foreground",
        destructive: "border-destructive/30 bg-destructive/5 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Hide the leading status icon. */
  hideIcon?: boolean;
}

/**
 * Inline status message. Uses `role="alert"` for destructive messages so they
 * are announced immediately, and `role="status"` otherwise.
 */
export function Alert({
  className,
  variant = "info",
  hideIcon = false,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant ?? "info"];
  const isUrgent = variant === "destructive";
  return (
    <div
      role={isUrgent ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {hideIcon ? null : (
        <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium leading-snug", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
