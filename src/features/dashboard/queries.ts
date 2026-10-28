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
import type { AdminDashboard, PatientDashboard } from "@/features/dashboard/types";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

function useQuery<T>(key: string, fetcher: () => Promise<T>): QueryState<T> {
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
