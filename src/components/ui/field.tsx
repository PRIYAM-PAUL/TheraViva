"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldProps {
  /** Visible label text. */
  label: React.ReactNode;
  /** Helper text shown beneath the control. */
  description?: React.ReactNode;
  /** Error message. Its presence marks the control invalid. */
  error?: string;
  /** Marks the field as required (visual + assistive). */
  required?: boolean;
  /** Explicit control id. Defaults to a generated unique id. */
  id?: string;
  className?: string;
  /** The control. Receives `id`, `aria-describedby`, `aria-invalid`, `required`. */
  children: React.ReactNode;
}

/**
 * Wraps a single form control with a label, helper text, and error message,
 * wiring up `id` / `aria-describedby` / `aria-invalid` so assistive tech
 * announces the label and any error.
 */
export function Field({
  label,
  description,
  error,
  required,
  id,
  className,
  children,
}: FieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  const control = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          id: fieldId,
          "aria-describedby": describedBy,
          "aria-invalid": invalid || undefined,
          required: required || undefined,
        },
      )
    : children;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      {control}
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
