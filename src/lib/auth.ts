/**
 * Auth token storage.
 *
 * Only the token pair is persisted (credentials, not personal data). The user
 * profile is held in memory and re-fetched from `/auth/me` on load, so no PHI is
 * written to browser storage — consistent with the project's privacy rules.
 */

const ACCESS_KEY = "theraviva.auth.access";
const REFRESH_KEY = "theraviva.auth.refresh";

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — tokens stay in memory only */
  }
}

export function getAccessToken(): string | null {
  return safeGet(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return safeGet(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string): void {
  safeSet(ACCESS_KEY, access);
  safeSet(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  safeSet(ACCESS_KEY, null);
  safeSet(REFRESH_KEY, null);
}

export function hasToken(): boolean {
  return Boolean(getAccessToken());
}
