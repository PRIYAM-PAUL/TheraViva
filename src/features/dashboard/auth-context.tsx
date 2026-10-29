"use client";

/**
 * Client-side auth context for the dashboards.
 *
 * Holds the signed-in user in memory only (tokens live in `lib/auth`). On mount
 * it verifies any stored token against `/auth/me`, so a stale token is cleared
 * rather than trusted.
 */

import * as React from "react";

import { api, ApiError } from "@/lib/api";
import { clearSessionHint, clearTokens, getAccessToken, setSessionHint } from "@/lib/auth";
import type { ApiUser, TokenPair } from "@/features/dashboard/types";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  signInPatient: (phone: string, code: string, name?: string) => Promise<ApiUser>;
  signInStaff: (email: string, password: string) => Promise<ApiUser>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ApiUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const applyTokens = React.useCallback((pair: TokenPair) => {
    setUser(pair.user);
    setSessionHint(pair.user.role);
  }, []);

  const refreshUser = React.useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      clearSessionHint();
      return;
    }
    try {
      const me = await api.auth.me();
      setUser(me);
      setSessionHint(me.role);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) clearTokens();
      clearSessionHint();
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    (async () => {
      if (!getAccessToken()) {
        clearSessionHint();
        if (active) setLoading(false);
        return;
      }
      try {
        const me = await api.auth.me();
        if (active) {
          setUser(me);
          setSessionHint(me.role);
        }
      } catch {
        clearTokens();
        clearSessionHint();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signInPatient = React.useCallback(
    async (phone: string, code: string, name?: string) => {
      const pair = await api.auth.verifyOtp(phone, code, name);
      applyTokens(pair);
      return pair.user;
    },
    [applyTokens],
  );

  const signInStaff = React.useCallback(
    async (email: string, password: string) => {
      const pair = await api.auth.staffLogin(email, password);
      applyTokens(pair);
      return pair.user;
    },
    [applyTokens],
  );

  const signOut = React.useCallback(async () => {
    await api.auth.logout();
    clearSessionHint();
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, loading, signInPatient, signInStaff, signOut, refreshUser }),
    [user, loading, signInPatient, signInStaff, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
