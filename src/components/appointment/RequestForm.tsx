"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
} from "lucide-react";
import * as React from "react";

import { ContactDetailsForm } from "@/components/appointment/ContactDetailsForm";
import { ModeSelector } from "@/components/appointment/ModeSelector";
import { ProfessionalSelector } from "@/components/appointment/ProfessionalSelector";
import { ServiceSelector } from "@/components/appointment/ServiceSelector";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { PREFERRED_DATE_HORIZON_DAYS, REQUEST_STEPS } from "@/config/appointment";
import { getServiceBySlug, professionals, services, timeWindows } from "@/data";
import { buildRequestMessage, buildRequestSubject } from "@/features/appointments/message";
import { validateRequest, validateRequestFields } from "@/features/appointments/schema";
import { useMounted } from "@/hooks/useMounted";
import { ApiError, api } from "@/lib/api";
import { trackLead } from "@/lib/analytics";
import { mailtoLink, whatsAppLink } from "@/lib/contact";
import { addDays, formatDateKey, startOfDay } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  AppointmentFieldErrors,
  AppointmentRequestValues,
  AppointmentType,
} from "@/types";

const INITIAL_VALUES: AppointmentRequestValues = {
  mode: null,
  serviceSlug: "",
  professionalId: "",
  preferredDate: "",
  preferredTime: "",
  fullName: "",
  phone: "",
  email: "",
  patientName: "",
  notes: "",
  consent: false,
};

const STEP_FIELDS: (keyof AppointmentRequestValues)[][] = [
  ["mode", "serviceSlug"],
  ["preferredDate", "preferredTime"],
  ["fullName", "phone", "email", "patientName", "notes", "consent"],
];

const ALL_MODES: AppointmentType[] = ["in-person", "video", "phone"];

/**
 * Multi-step appointment request.
 *
 * No backend: on submit the request is composed into a message and handed to
 * WhatsApp or the visitor's email client. Nothing is stored on this site.
 */
export function RequestForm() {
  const mounted = useMounted();
  const [values, setValues] = React.useState<AppointmentRequestValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<AppointmentFieldErrors>({});
  const [step, setStep] = React.useState(0);
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const setField = React.useCallback(
    (field: keyof AppointmentRequestValues, value: string | boolean) => {
      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => {
        if (!(field in previous)) return previous;
        const next = { ...previous };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleModeChange = React.useCallback((mode: AppointmentType) => {
    setValues((previous) => {
      const service = previous.serviceSlug
        ? getServiceBySlug(previous.serviceSlug)
        : undefined;
      const stillValid = service ? service.modes.includes(mode) : true;
      return {
        ...previous,
        mode,
        serviceSlug: stillValid ? previous.serviceSlug : "",
        professionalId: stillValid ? previous.professionalId : "",
      };
    });
    setErrors({});
  }, []);

  const handleServiceChange = React.useCallback((slug: string) => {
    setValues((previous) => {
      const service = getServiceBySlug(slug);
      const keepProfessional =
        service && previous.professionalId
          ? service.professionalIds.includes(previous.professionalId)
          : false;
      return {
        ...previous,
        serviceSlug: slug,
        professionalId: keepProfessional ? previous.professionalId : "",
      };
    });
    setErrors((previous) => {
      if (!("serviceSlug" in previous)) return previous;
      const next = { ...previous };
      delete next.serviceSlug;
      return next;
    });
  }, []);

  const availableServices = React.useMemo(
    () =>
      values.mode
        ? services.filter((service) => service.modes.includes(values.mode as AppointmentType))
        : services,
    [values.mode],
  );

  const availableProfessionals = React.useMemo(() => {
    const service = values.serviceSlug
      ? getServiceBySlug(values.serviceSlug)
      : undefined;
    if (!service) return professionals;
    return professionals.filter((professional) =>
      service.professionalIds.includes(professional.id),
    );
  }, [values.serviceSlug]);

  const stepErrors = React.useMemo(
    () => validateRequestFields(values, STEP_FIELDS[step]),
    [values, step],
  );
  const canContinue = Object.keys(stepErrors).length === 0;

  const goNext = () => {
    const found = validateRequestFields(values, STEP_FIELDS[step]);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, REQUEST_STEPS.length - 1));
  };

  const goPrevious = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSend = (method: "whatsapp" | "email") => {
    const result = validateRequest(values);
    if (!result.success) {
      setErrors(result.errors);
      const firstInvalid = STEP_FIELDS.findIndex((fields) =>
        fields.some((field) => field in result.errors),
      );
      if (firstInvalid >= 0) setStep(firstInvalid);
      return;
    }

    const body = buildRequestMessage(values);
    if (method === "whatsapp") {
      window.open(whatsAppLink(body), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = mailtoLink(buildRequestSubject(values), body);
    }
    trackLead(method, values.serviceSlug || undefined);
    setSent(true);
  };

  const submitRequest = async () => {
    const result = validateRequest(values);
    if (!result.success) {
      setErrors(result.errors);
      const firstInvalid = STEP_FIELDS.findIndex((fields) =>
        fields.some((field) => field in result.errors),
      );
      if (firstInvalid >= 0) setStep(firstInvalid);
      return;
    }
    setBusy(true);
    setSubmitError(null);
    try {
      const saved = await api.intake.appointmentRequest({
        mode: values.mode,
        serviceSlug: values.serviceSlug,
        professionalId: values.professionalId,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        patientName: values.patientName,
        notes: values.notes,
        consent: values.consent,
      });
      setReference(saved.reference);
      setSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Could not send your request. Please try WhatsApp or email instead.",
      );
    } finally {
      setBusy(false);
    }
  };

  const today = mounted ? startOfDay(new Date()) : null;
  const maxDate = today ? addDays(today, PREFERRED_DATE_HORIZON_DAYS) : null;

  if (sent) {
    return (
      <Card role="status" aria-live="polite">
        <CardContent className="space-y-5 pt-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Request received
            </h2>
            <p className="mx-auto max-w-prose text-sm text-muted-foreground">
              Your request has been saved
              {reference ? (
                <>
                  {" "}
                  with reference <strong>{reference}</strong>
                </>
              ) : null}
              . The practice will reply to confirm a time — this is not a confirmed
              appointment yet. You can also message them directly below.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" variant="outline" onClick={() => handleSend("whatsapp")}>
              <MessageCircle className="size-4" aria-hidden="true" />
              Also send on WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSend("email")}
            >
              <Mail className="size-4" aria-hidden="true" />
              Also email the practice
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setStep(0);
              setReference(null);
              setSubmitError(null);
            }}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Start a new request
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ol className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        {REQUEST_STEPS.map((requestStep, index) => {
          const isCurrent = index === step;
          const isComplete = index < step;
          return (
            <li key={requestStep.id} className="flex-1">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-3 px-1 py-1"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isComplete && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isComplete && !isCurrent && "border-border text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCurrent || isComplete ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {requestStep.label}
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {requestStep.description}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Announce step changes to assistive tech, which the visual stepper alone
          does not convey. */}
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {REQUEST_STEPS.length}: {REQUEST_STEPS[step].label}
      </p>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (step < REQUEST_STEPS.length - 1) goNext();
        }}
      >
        <Card>
          <CardContent className="space-y-6 pt-6">
            {step === 0 ? (
              <div className="space-y-7">
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-semibold">
                    How would you like to meet?
                  </h2>
                  <ModeSelector
                    modes={ALL_MODES}
                    value={values.mode}
                    onChange={handleModeChange}
                    idPrefix="request-mode"
                  />
                  {errors.mode ? (
                    <p role="alert" className="text-xs font-medium text-destructive">
                      {errors.mode}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <h2 className="font-display text-lg font-semibold">
                    What would you like help with?
                  </h2>
                  <ServiceSelector
                    services={availableServices}
                    value={values.serviceSlug}
                    onChange={handleServiceChange}
                    mode={values.mode}
                    idPrefix="request-service"
                  />
                  {errors.serviceSlug ? (
                    <p role="alert" className="text-xs font-medium text-destructive">
                      {errors.serviceSlug}
                    </p>
                  ) : null}
                </div>

                {values.serviceSlug ? (
                  <div className="space-y-3">
                    <h2 className="font-display text-lg font-semibold">
                      Preferred specialist (optional)
                    </h2>
                    <ProfessionalSelector
                      professionals={availableProfessionals}
                      value={values.professionalId}
                      onChange={(id) => setField("professionalId", id)}
                      idPrefix="request-professional"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <h2 className="font-display text-lg font-semibold">
                  When would suit you?
                </h2>
                <p className="text-sm text-muted-foreground">
                  This is a preference, not a confirmed slot. The practice will
                  offer the closest available time.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="request-date"
                    label="Preferred date (optional)"
                    error={errors.preferredDate}
                  >
                    <Input
                      name="preferredDate"
                      type="date"
                      value={values.preferredDate}
                      min={today ? formatDateKey(today) : undefined}
                      max={maxDate ? formatDateKey(maxDate) : undefined}
                      onChange={(event) => setField("preferredDate", event.target.value)}
                    />
                  </Field>

                  <Field
                    id="request-time"
                    label="Preferred time (optional)"
                    error={errors.preferredTime}
                  >
                    <Select
                      options={timeWindows}
                      value={values.preferredTime || null}
                      onValueChange={(value) => setField("preferredTime", value)}
                      placeholder="Choose a time window"
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <h2 className="font-display text-lg font-semibold">
                  Your details
                </h2>
                <ContactDetailsForm
                  values={values}
                  errors={errors}
                  onChange={setField}
                  idPrefix="request-contact"
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Alert variant="info" className="mt-4">
          <AlertTitle>How this works</AlertTitle>
          <AlertDescription>
            Your request is saved to the practice securely — no payment is taken
            here. The practice will reply to confirm a time. You can also message
            them directly on WhatsApp or by email.
          </AlertDescription>
        </Alert>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrevious}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>

          <p className="order-last text-center text-xs text-muted-foreground sm:order-none">
            Step {step + 1} of {REQUEST_STEPS.length}
          </p>

          {step < REQUEST_STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="w-full sm:w-auto"
            >
              Continue
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              {submitError ? (
                <p role="alert" className="text-xs font-medium text-destructive sm:mr-2">
                  {submitError}
                </p>
              ) : null}
              <Button
                type="button"
                loading={busy}
                onClick={() => void submitRequest()}
                className="w-full sm:w-auto"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Send request
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
