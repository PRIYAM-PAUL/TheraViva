"use client";

import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
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
  Spinner,
} from "@/components/ui";
import { getServiceBySlug, professionals, services } from "@/data";
import { useQuery } from "@/features/dashboard/queries";
import type { Appointment, AvailabilitySlot } from "@/features/dashboard/types";
import { validateRequestFields } from "@/features/appointments/schema";
import { ApiError, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  AppointmentFieldErrors,
  AppointmentRequestValues,
  AppointmentType,
} from "@/types";

const ALL_MODES: AppointmentType[] = ["in-person", "video", "phone"];

const STEPS = [
  { id: "service", label: "Service", description: "What you need" },
  { id: "time", label: "Time", description: "Pick a slot" },
  { id: "details", label: "Details", description: "Your information" },
];

const INITIAL_VALUES: AppointmentRequestValues = {
  mode: "in-person",
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

const DETAIL_FIELDS: (keyof AppointmentRequestValues)[] = [
  "fullName",
  "phone",
  "email",
  "patientName",
  "notes",
  "consent",
];

function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA");
}

function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

/** Real slot booking: availability → slot → details → persist to the database. */
export function BookingWizard() {
  const [values, setValues] = React.useState<AppointmentRequestValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<AppointmentFieldErrors>({});
  const [step, setStep] = React.useState(0);
  const [selectedSlot, setSelectedSlot] = React.useState<AvailabilitySlot | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Appointment | null>(null);

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

  const mode = values.mode as AppointmentType;

  const availableServices = React.useMemo(
    () => services.filter((service) => service.modes.includes(mode)),
    [mode],
  );

  const availableProfessionals = React.useMemo(() => {
    const service = values.serviceSlug ? getServiceBySlug(values.serviceSlug) : undefined;
    if (!service) return professionals;
    return professionals.filter((p) => service.professionalIds.includes(p.id));
  }, [values.serviceSlug]);

  // Default the professional to the first who offers the chosen service (derived,
  // not stored in state, so there is no setState-in-effect cascade).
  const effectiveProfessionalId =
    values.professionalId || availableProfessionals[0]?.id || "";

  const today = React.useMemo(() => new Date(), []);
  const from = today.toLocaleDateString("en-CA");
  const to = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString("en-CA");
  }, []);

  const availability = useQuery<AvailabilitySlot[]>(
    `slots:${mode}:${effectiveProfessionalId}`,
    () =>
      effectiveProfessionalId
        ? api.appointments.availability(effectiveProfessionalId, mode, from, to)
        : Promise.resolve([]),
  );

  const slotsByDay = React.useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    for (const slot of availability.data ?? []) {
      const key = dayKey(slot.startsAt);
      const list = map.get(key) ?? [];
      list.push(slot);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [availability.data]);

  const [activeDay, setActiveDay] = React.useState<string | null>(null);
  const currentDay = activeDay ?? slotsByDay[0]?.[0] ?? null;
  const currentSlots = slotsByDay.find(([key]) => key === currentDay)?.[1] ?? [];

  const stepErrors = React.useMemo(() => {
    if (step === 0) return validateRequestFields(values, ["mode", "serviceSlug"]);
    if (step === 1) return selectedSlot ? {} : { preferredTime: "Choose a time slot." };
    return validateRequestFields(values, DETAIL_FIELDS);
  }, [step, values, selectedSlot]);

  const goNext = () => {
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const submit = async () => {
    const allErrors = {
      ...validateRequestFields(values, ["mode", "serviceSlug"]),
      ...(selectedSlot ? {} : { preferredTime: "Choose a time slot." }),
      ...validateRequestFields(values, DETAIL_FIELDS),
    };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    setBusy(true);
    setSubmitError(null);
    try {
      const created = await api.appointments.create({
        serviceSlug: values.serviceSlug,
        professionalId: effectiveProfessionalId,
        mode,
        startsAt: selectedSlot?.startsAt,
        notes: values.notes,
        hold: false,
      });
      setResult(created);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Could not book the appointment.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <Card role="status" aria-live="polite">
        <CardContent className="space-y-5 pt-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Appointment requested
            </h2>
            <p className="mx-auto max-w-prose text-sm text-muted-foreground">
              Reference <strong>{result.reference}</strong> ·{" "}
              {new Date(result.startsAt).toLocaleString("en-IN")}. The practice will
              confirm your slot. Track it from your dashboard.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/appointments"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View my appointments
            </Link>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setSelectedSlot(null);
                setStep(0);
                setValues(INITIAL_VALUES);
              }}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Book another
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ol className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        {STEPS.map((wizardStep, index) => {
          const isCurrent = index === step;
          const isComplete = index < step;
          return (
            <li key={wizardStep.id} className="flex-1">
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
                    {wizardStep.label}
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {wizardStep.description}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <Card>
        <CardContent className="space-y-6 pt-6">
          {step === 0 ? (
            <div className="space-y-7">
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold">How would you like to meet?</h2>
                <ModeSelector
                  modes={ALL_MODES}
                  value={values.mode}
                  onChange={(next) => setField("mode", next)}
                  idPrefix="wizard-mode"
                />
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold">What would you like help with?</h2>
                <ServiceSelector
                  services={availableServices}
                  value={values.serviceSlug}
                  onChange={(slug) => setField("serviceSlug", slug)}
                  mode={mode}
                  idPrefix="wizard-service"
                />
                {errors.serviceSlug ? (
                  <p role="alert" className="text-xs font-medium text-destructive">
                    {errors.serviceSlug}
                  </p>
                ) : null}
              </div>
              {values.serviceSlug ? (
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-semibold">Preferred specialist</h2>
                  <ProfessionalSelector
                    professionals={availableProfessionals}
                    value={effectiveProfessionalId}
                    onChange={(id) => setField("professionalId", id)}
                    idPrefix="wizard-professional"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Choose a time</h2>
              {availability.loading ? (
                <div className="flex justify-center py-12">
                  <Spinner label="Loading available times" className="size-6" />
                </div>
              ) : null}
              {availability.error ? (
                <Alert variant="destructive">
                  <AlertTitle>Could not load times</AlertTitle>
                  <AlertDescription>{availability.error}</AlertDescription>
                </Alert>
              ) : null}
              {!availability.loading && slotsByDay.length === 0 ? (
                <Alert variant="info">
                  <AlertTitle>No open slots in the next two weeks</AlertTitle>
                  <AlertDescription>
                    Send a request instead and the practice will offer the closest
                    available time.
                  </AlertDescription>
                </Alert>
              ) : null}

              {slotsByDay.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {slotsByDay.map(([key, daySlots]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveDay(key)}
                        aria-pressed={key === currentDay}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                          key === currentDay
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:bg-accent",
                        )}
                      >
                        {dayLabel(daySlots[0].startsAt)}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {currentSlots.map((slot) => {
                      const active = selectedSlot?.startsAt === slot.startsAt;
                      return (
                        <button
                          key={slot.startsAt}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          aria-pressed={active}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-foreground hover:bg-accent",
                          )}
                        >
                          {timeLabel(slot.startsAt)}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
              {errors.preferredTime ? (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.preferredTime}
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Your details</h2>
              {selectedSlot ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
                  {new Date(selectedSlot.startsAt).toLocaleString("en-IN")}
                </p>
              ) : null}
              <ContactDetailsForm
                values={values}
                errors={errors}
                onChange={setField}
                idPrefix="wizard-contact"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      {submitError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not book the appointment</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setErrors({});
            setStep((current) => Math.max(current - 1, 0));
          }}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={goNext} disabled={Object.keys(stepErrors).length > 0}>
            Continue
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="button" loading={busy} onClick={() => void submit()}>
            <CalendarCheck className="size-4" aria-hidden="true" />
            Book appointment
          </Button>
        )}
      </div>
    </div>
  );
}
