/**
 * Auth token storage.
 *
 * Only the token pair is persisted (credentials, not personal data). The user
 * profile is held in memory and re-fetched from `/auth/me` on load, so no PHI is
 * written to browser storage — consistent with the project's privacy rules.
 */

const ACCESS_KEY = "theraviva.auth.access";
const REFRESH_KEY = "theraviva.auth.refresh";

/**
 * Non-sensitive routing hint (the user's role) exposed as a cookie so the Next
 * proxy can gate `/dashboard` and `/staff` before render. It is deliberately NOT
 * httpOnly because the browser sets it on login; it carries no token and no
 * personal data, and the backend still authorizes every request.
 */
const HINT_COOKIE = "theraviva.session";
const HINT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

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

/** Read the routing-hint cookie (used by the proxy and the dashboard header). */
export function getSessionHint(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${HINT_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Set the routing-hint cookie after a successful login / `/auth/me`. */
export function setSessionHint(role: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${HINT_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${HINT_MAX_AGE_SECONDS}; samesite=lax`;
}

export function clearSessionHint(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
