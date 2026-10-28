"use client";

import * as React from "react";

import { CONSENT_STORAGE_KEY as STORAGE_KEY } from "@/lib/analytics";

export type ConsentValue = "granted" | "denied" | null;

/**
 * Consent is stored in an external store rather than component state, so it can
 * be read with `useSyncExternalStore` — which keeps the server snapshot (`null`)
 * and the first client render in agreement and avoids a hydration mismatch.
 */
const listeners = new Set<() => void>();
let snapshot: ConsentValue = null;
let initialised = false;

function readStored(): ConsentValue {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      snapshot = readStored();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ConsentValue {
  if (!initialised) {
    initialised = true;
    snapshot = readStored();
  }
  return snapshot;
}

function getServerSnapshot(): ConsentValue {
  return null;
}

function persist(value: Exclude<ConsentValue, null>) {
  snapshot = value;
  initialised = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the in-memory value still applies */
  }
  emit();
}

const noopSubscribe = () => () => {};

interface ConsentContextValue {
  /** Current decision, or `null` when the visitor has not chosen yet. */
  consent: ConsentValue;
  /** Whether analytics may load. */
  analyticsAllowed: boolean;
  /** True once the stored decision has been read on the client. */
  ready: boolean;
  grant: () => void;
  deny: () => void;
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null);
ConsentContext.displayName = "ConsentContext";

/**
 * Stores the visitor's analytics-consent decision locally.
 *
 * Only the decision itself is stored — never personal or clinical data.
 * Analytics scripts are gated on this value.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const grant = React.useCallback(() => persist("granted"), []);
  const deny = React.useCallback(() => persist("denied"), []);

  const value = React.useMemo<ConsentContextValue>(
    () => ({
      consent,
      analyticsAllowed: consent === "granted",
      ready,
      grant,
      deny,
    }),
    [consent, ready, grant, deny],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a <ConsentProvider>.");
  }
  return context;
}
