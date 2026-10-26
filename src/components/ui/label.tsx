import * as React from "react";

import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  /** Marks the field as required for assistive technology. */
  required?: boolean;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ className, required, children, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none text-foreground",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        )}
        {...props}
      >
        {children}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
    );
  },
);
