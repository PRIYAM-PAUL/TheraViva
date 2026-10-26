"use client";

import { MapPin, Phone, Video } from "lucide-react";

import { MODE_DESCRIPTIONS, MODE_LABELS } from "@/config/appointment";
import { cn } from "@/lib/utils";
import type { AppointmentType } from "@/types";

export const modeIcons: Record<AppointmentType, typeof MapPin> = {
  "in-person": MapPin,
  video: Video,
  phone: Phone,
};

export interface ModeSelectorProps {
  modes: AppointmentType[];
  value: AppointmentType | null;
  onChange: (mode: AppointmentType) => void;
  idPrefix: string;
  disabled?: boolean;
}

/** Radio group for choosing how the appointment takes place. */
export function ModeSelector({
  modes,
  value,
  onChange,
  idPrefix,
  disabled = false,
}: ModeSelectorProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="sr-only">Choose how you would like to meet</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {modes.map((mode) => {
          const inputId = `${idPrefix}-${mode}`;
          const Icon = modeIcons[mode];
          const selected = value === mode;
          return (
            <label
              key={mode}
              htmlFor={inputId}
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 transition-colors",
                "hover:border-primary/60",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                selected ? "border-primary bg-accent/40" : "border-border",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={`${idPrefix}-mode`}
                value={mode}
                checked={selected}
                onChange={() => onChange(mode)}
                className="sr-only"
              />
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <span className="font-medium text-foreground">
                {MODE_LABELS[mode]}
              </span>
              <span className="text-sm text-muted-foreground">
                {MODE_DESCRIPTIONS[mode]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
