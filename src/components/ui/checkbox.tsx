"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
    "className" | "children"
  > {
  className?: string;
  /** Visible label rendered beside the control and associated via `htmlFor`. */
  label?: React.ReactNode;
  /** Optional helper text beneath the label. */
  description?: React.ReactNode;
}

/**
 * Accessible checkbox built on Base UI. Renders a visible box plus a hidden
 * native input for form submission. A single `id` links the label to the input.
 */
export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      label,
      description,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const describedBy =
      [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <BaseCheckbox.Root
          ref={ref}
          id={checkboxId}
          aria-describedby={describedBy}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-input bg-background text-primary-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[checked]:border-primary data-[checked]:bg-primary",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            "aria-invalid:border-destructive",
          )}
          {...props}
        >
          <BaseCheckbox.Indicator className="flex items-center justify-center">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>

        {label || description ? (
          <div className="space-y-1 leading-none">
            {label ? (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-foreground"
              >
                {label}
              </label>
            ) : null}
            {description ? (
              <p id={descriptionId} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
