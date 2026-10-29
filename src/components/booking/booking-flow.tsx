"use client";

import { CalendarClock, Send } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { RequestForm } from "@/components/appointment";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Alert, AlertDescription, AlertTitle, Button } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";
import { cn } from "@/lib/utils";

type Mode = "slot" | "request";

/**
 * Booking entry point.
 *
 * "Book a slot" uses real availability and persists the appointment (it needs a
 * signed-in patient so the booking can be linked to them). "Send a request" is
 * the always-available fallback and also persists to the intake queue.
 */
export function BookingFlow() {
  const { user, loading } = useAuth();
  const [mode, setMode] = React.useState<Mode>("slot");

  const isPatient = user?.role === "patient";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1 sm:max-w-md">
        <button
          type="button"
          onClick={() => setMode("slot")}
          aria-pressed={mode === "slot"}
          className={cn(
            "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            mode === "slot" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          <CalendarClock className="size-4" aria-hidden="true" />
          Book a slot
        </button>
        <button
          type="button"
          onClick={() => setMode("request")}
          aria-pressed={mode === "request"}
          className={cn(
            "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            mode === "request" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          <Send className="size-4" aria-hidden="true" />
          Send a request
        </button>
      </div>

      {mode === "slot" ? (
        loading ? null : isPatient ? (
          <BookingWizard />
        ) : (
          <Alert variant="info">
            <AlertTitle>Sign in to book a real slot</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                Booking a slot reserves it in the practice calendar and links it to
                your account. Sign in with your phone number to continue.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/login?next=/book" className="inline-flex">
                  <Button size="sm">Sign in to book</Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => setMode("request")}>
                  Or send a request instead
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )
      ) : (
        <RequestForm />
      )}
    </div>
  );
}
