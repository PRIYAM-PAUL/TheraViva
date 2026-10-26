"use client";

import { Checkbox, Field, Input, Textarea } from "@/components/ui";
import type { AppointmentFieldErrors, AppointmentRequestValues } from "@/types";

export interface ContactDetailsFormProps {
  values: AppointmentRequestValues;
  errors: AppointmentFieldErrors;
  onChange: (
    field: keyof AppointmentRequestValues,
    value: string | boolean,
  ) => void;
  disabled?: boolean;
  idPrefix: string;
}

/**
 * Contact details for a request. Deliberately does NOT render a `<form>` — the
 * parent owns the single form element.
 */
export function ContactDetailsForm({
  values,
  errors,
  onChange,
  disabled = false,
  idPrefix,
}: ContactDetailsFormProps) {
  const consentErrorId = `${idPrefix}-consent-error`;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${idPrefix}-fullName`} label="Your name" required error={errors.fullName}>
          <Input
            name="fullName"
            autoComplete="name"
            value={values.fullName}
            disabled={disabled}
            onChange={(event) => onChange("fullName", event.target.value)}
          />
        </Field>

        <Field
          id={`${idPrefix}-phone`}
          label="Phone / WhatsApp number"
          required
          error={errors.phone}
          description="The practice will use this to confirm your appointment."
        >
          <Input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            disabled={disabled}
            onChange={(event) => onChange("phone", event.target.value)}
          />
        </Field>
      </div>

      <Field
        id={`${idPrefix}-email`}
        label="Email (optional)"
        error={errors.email}
        description="Add an email if you would prefer a written reply."
      >
        <Input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          disabled={disabled}
          onChange={(event) => onChange("email", event.target.value)}
        />
      </Field>

      <Field
        id={`${idPrefix}-patientName`}
        label="Who is the appointment for?"
        required
        error={errors.patientName}
        description="If this is for your child, enter their name and age if you can."
      >
        <Input
          name="patientName"
          value={values.patientName}
          disabled={disabled}
          onChange={(event) => onChange("patientName", event.target.value)}
        />
      </Field>

      <Field
        id={`${idPrefix}-notes`}
        label="What would you like help with? (optional)"
        error={errors.notes}
        description="A sentence or two is plenty. Please avoid sharing sensitive medical records here."
      >
        <Textarea
          name="notes"
          rows={4}
          value={values.notes}
          disabled={disabled}
          onChange={(event) => onChange("notes", event.target.value)}
        />
      </Field>

      <div className="space-y-2">
        <Checkbox
          id={`${idPrefix}-consent`}
          checked={values.consent}
          disabled={disabled}
          onCheckedChange={(checked) => onChange("consent", checked)}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? consentErrorId : undefined}
          label="I'm happy for the practice to contact me about this request"
          description="This sends a request — it is not a confirmed appointment. Your details go directly to the practice and are not stored on this website."
        />
        {errors.consent ? (
          <p
            id={consentErrorId}
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errors.consent}
          </p>
        ) : null}
      </div>
    </div>
  );
}
