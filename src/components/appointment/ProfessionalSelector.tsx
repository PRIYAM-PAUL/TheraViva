"use client";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Professional } from "@/types";

export interface ProfessionalSelectorProps {
  professionals: Professional[];
  /** Selected professional id, or "" for no preference. */
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  disabled?: boolean;
}

const NO_PREFERENCE = "";

/** Optional clinician choice, including a "No preference" option. */
export function ProfessionalSelector({
  professionals,
  value,
  onChange,
  idPrefix,
  disabled = false,
}: ProfessionalSelectorProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="sr-only">Choose a clinician (optional)</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label
          htmlFor={`${idPrefix}-none`}
          className={cn(
            "flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 transition-colors",
            "hover:border-primary/60",
            "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
            value === NO_PREFERENCE ? "border-primary bg-accent/40" : "border-border",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <input
            id={`${idPrefix}-none`}
            type="radio"
            name={`${idPrefix}-professional`}
            value=""
            checked={value === NO_PREFERENCE}
            onChange={() => onChange(NO_PREFERENCE)}
            className="sr-only"
          />
          <span className="font-medium text-foreground">No preference</span>
          <span className="text-sm text-muted-foreground">
            We&apos;ll match you with the right specialist for your needs.
          </span>
        </label>

        {professionals.map((professional) => {
          const selected = value === professional.id;
          return (
            <label
              key={professional.id}
              htmlFor={`${idPrefix}-${professional.id}`}
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 transition-colors",
                "hover:border-primary/60",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                selected ? "border-primary bg-accent/40" : "border-border",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={`${idPrefix}-${professional.id}`}
                type="radio"
                name={`${idPrefix}-professional`}
                value={professional.id}
                checked={selected}
                onChange={() => onChange(professional.id)}
                className="sr-only"
              />
              <span className="font-medium text-foreground">
                {professional.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {professional.headline}
              </span>
              <span className="mt-1 flex flex-wrap gap-1">
                {professional.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="neutral">
                    {skill}
                  </Badge>
                ))}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
