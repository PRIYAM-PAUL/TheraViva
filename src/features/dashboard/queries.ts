"use client";

/**
 * Dashboard data hooks: thin wrappers over the API client with loading and
 * error state, so pages stay declarative.
 *
 * The fetcher is held in a ref and the effect is keyed on a stable string, which
 * avoids re-running on every render and keeps the React Compiler's
 * set-state-in-effect rule satisfied.
 */

import * as React from "react";

import { api, ApiError } from "@/lib/api";
import type {
  AdminDashboard,
  Appointment,
  ChatMessage,
  ChatThread,
  DocumentItem,
  Invoice,
  Page,
  PatientDashboard,
  Payment,
  StaffUser,
} from "@/features/dashboard/types";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useQuery<T>(key: string, fetcher: () => Promise<T>): QueryState<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [nonce, setNonce] = React.useState(0);

  const fetcherRef = React.useRef(fetcher);
  React.useEffect(() => {
    fetcherRef.current = fetcher;
  });

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const result = await fetcherRef.current();
        if (!active) return;
        setData(result);
        setError(null);
        setLoading(false);
      } catch (err: unknown) {
        if (!active) return;
        setData(null);
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
        setLoading(false);
      }
    };
    void run();
    return () => {
      active = false;
    };
  }, [key, nonce]);

  const reload = React.useCallback(() => setNonce((value) => value + 1), []);

  return { data, loading, error, reload };
}

export function usePatientDashboard(enabled: boolean): QueryState<PatientDashboard> {
  return useQuery(enabled ? "patient" : "patient:idle", () =>
    enabled ? api.dashboard.patient() : new Promise<PatientDashboard>(() => {}),
  );
}

export function useAdminDashboard(from?: string, to?: string): QueryState<AdminDashboard> {
  return useQuery(`admin:${from ?? ""}:${to ?? ""}`, () => api.dashboard.admin(from, to));
}

export function useDocuments(kind?: string): QueryState<Page<DocumentItem>> {
  return useQuery(`documents:${kind ?? "all"}`, () => api.documents.list(kind));
}

export function useChatThreads(): QueryState<Page<ChatThread>> {
  return useQuery("chat:threads", () => api.chat.threads());
}

export function useChatMessages(threadId: string | null): QueryState<ChatMessage[]> {
  return useQuery(`chat:messages:${threadId ?? "none"}`, () =>
    threadId ? api.chat.messages(threadId) : new Promise<ChatMessage[]>(() => []),
  );
}

export function useAppointments(params: { status?: string } = {}): QueryState<Page<Appointment>> {
  return useQuery(`appointments:${params.status ?? "all"}`, () => api.appointments.list(params));
}

export function useInvoices(): QueryState<Page<Invoice>> {
  return useQuery("invoices", () => api.billing.invoices());
}

export function usePayments(invoiceId?: string): QueryState<Page<Payment>> {
  return useQuery(`payments:${invoiceId ?? "all"}`, () => api.billing.payments(invoiceId));
}

export function useAdminUsers(): QueryState<Page<StaffUser>> {
  return useQuery("admin:users", () => api.admin.users());
}

export function useStaffPatients(): QueryState<Page<StaffUser>> {
  return useQuery("staff:patients", () => api.admin.patients());
}

export function useAdminIntake(kind: string, status?: string): QueryState<Page<Record<string, unknown>>> {
  return useQuery(`admin:intake:${kind}:${status ?? "all"}`, () => api.admin.intake(kind, status));
}
