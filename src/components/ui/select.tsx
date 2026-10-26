"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { Option } from "@/types";

export interface SelectProps<TValue extends string = string> {
  /** Currently selected value, or `null` when nothing is chosen. */
  value: TValue | null;
  onValueChange: (value: TValue) => void;
  options: readonly Option<TValue>[];
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  className?: string;
  /** Control height. `sm` matches compact toolbars; `md` matches inputs. */
  size?: "sm" | "md";
}

/**
 * Accessible listbox select built on Base UI. Keyboard-navigable, with a
 * visible focus ring and an associated hidden input for form submission.
 */
export function Select<TValue extends string = string>({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  id,
  name,
  disabled,
  required,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  size = "md",
}: SelectProps<TValue>) {
  const items = React.useMemo(
    () =>
      options.map((option) => ({
        label: option.label,
        value: option.value as string,
      })),
    [options],
  );

  return (
    <BaseSelect.Root
      value={value}
      onValueChange={(next) => {
        if (next != null) onValueChange(next as TValue);
      }}
      items={items}
      name={name}
      disabled={disabled}
      required={required}
    >
      <BaseSelect.Trigger
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive",
          size === "sm" ? "h-9" : "h-10",
          className,
        )}
      >
        <BaseSelect.Value
          placeholder={placeholder}
          className="truncate text-left data-[placeholder]:text-muted-foreground"
        />
        <BaseSelect.Icon className="shrink-0 text-muted-foreground">
          <ChevronDown className="size-4" aria-hidden="true" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup
            className={cn(
              "max-h-72 min-w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-soft",
              "origin-[var(--transform-origin)] transition-[transform,opacity] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            )}
          >
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value as string}
                  disabled={option.disabled}
                  className={cn(
                    "flex cursor-default select-none items-center gap-2 rounded-md px-2 py-2 text-sm outline-none",
                    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    <BaseSelect.ItemIndicator>
                      <Check className="size-4" aria-hidden="true" />
                    </BaseSelect.ItemIndicator>
                  </span>
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
