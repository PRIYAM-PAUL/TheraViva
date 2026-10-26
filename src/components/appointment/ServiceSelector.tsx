"use client";

import { Clock } from "lucide-react";

import { Badge } from "@/components/ui";
import { MODE_LABELS } from "@/config/appointment";
import { formatServicePrice } from "@/features/appointments/pricing";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AppointmentType, Service } from "@/types";

export interface ServiceSelectorProps {
  services: Service[];
  /** Selected service slug, or "". */
  value: string;
  onChange: (slug: string) => void;
  /** Show the price for this mode when set. */
  mode?: AppointmentType | null;
  idPrefix: string;
  disabled?: boolean;
}

/** Single-select list of services as a radio group of cards. */
export function ServiceSelector({
  services,
  value,
  onChange,
  mode = null,
  idPrefix,
  disabled = false,
}: ServiceSelectorProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="sr-only">Choose a service</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const inputId = `${idPrefix}-${service.slug}`;
          const selected = value === service.slug;
          return (
            <label
              key={service.slug}
              htmlFor={inputId}
              className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
                "hover:border-primary/60",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                selected ? "border-primary bg-accent/40" : "border-border",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={`${idPrefix}-service`}
                value={service.slug}
                checked={selected}
                onChange={() => onChange(service.slug)}
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-3">
                <span className="font-medium text-foreground">
                  {service.title}
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatServicePrice(service, mode)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{service.summary}</p>

              <div className="mt-auto flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Clock className="size-3" aria-hidden="true" />
                  {formatDuration(service.durationMinutes)}
                </Badge>
                {service.modes.map((serviceMode) => (
                  <Badge key={serviceMode} variant="neutral">
                    {MODE_LABELS[serviceMode]}
                  </Badge>
                ))}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
