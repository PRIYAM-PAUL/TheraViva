"use client";

import * as React from "react";

import {
  applyTheme,
  DEFAULT_THEME,
  getInitialTheme,
  getStoredTheme,
  isThemeId,
  resolveSystemTheme,
  storeTheme,
  THEMES,
  type ThemeDefinition,
  type ThemeId,
} from "@/lib/theme";

export interface ThemeContextValue {
  /** The active theme id. */
  theme: ThemeId;
  /** Select a theme explicitly. The choice is persisted to `localStorage`. */
  setTheme: (id: ThemeId) => void;
  /** Every available theme, for rendering a picker. */
  themes: readonly ThemeDefinition[];
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

/* ---------------------------------------------------------------------------
 * External store
 *
 * The active theme is read from the DOM (`data-theme`), which the no-flash
 * script and `applyTheme` keep authoritative. Reading it back — rather than
 * holding React state — keeps the store stateless, avoids `setState` inside an
 * effect, and lets `useSyncExternalStore` hydrate safely: the server snapshot
 * is always the default, and the real value is reconciled after hydration.
 * ------------------------------------------------------------------------- */

type Listener = () => void;

const listeners = new Set<Listener>();

function readTheme(): ThemeId {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (isThemeId(attr)) return attr;
  }
  return getInitialTheme();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ThemeId {
  return readTheme();
}

function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

function select(id: ThemeId, persist: boolean): void {
  if (!isThemeId(id)) return;
  applyTheme(id);
  if (persist) storeTheme(id);
  listeners.forEach((listener) => listener());
}

/**
 * Provides the active theme and a setter to the tree. Render it high in the
 * app (root layout) so every route shares one theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setTheme = React.useCallback((id: ThemeId) => {
    select(id, true);
  }, []);

  // Apply the resolved theme after mount (covers the case where the inline
  // script did not run) and follow OS changes while no explicit choice exists.
  React.useEffect(() => {
    applyTheme(getSnapshot());

    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getStoredTheme()) return;
      select(resolveSystemTheme(), false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, themes: THEMES }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Read the active theme and setter. Throws outside a `<ThemeProvider>`. */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
}
