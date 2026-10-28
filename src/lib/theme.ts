/**
 * Theme registry and DOM helpers.
 *
 * This module is deliberately free of React and of any `next/*` import so it
 * can be unit-tested directly and reused by the no-flash inline script. The
 * React binding lives in `@/components/theme/theme-provider`.
 *
 * A theme is applied by setting `data-theme` on `<html>`; the matching CSS
 * block in `src/styles/themes.css` re-points the design tokens. The `light`
 * theme is the `:root` default in `tokens.css`, so it has no block of its own.
 */

export type ThemeId =
  | "light"
  | "soft"
  | "medical"
  | "wellness"
  | "sunrise"
  | "midnight";

export interface ThemeDefinition {
  id: ThemeId;
  /** Human label shown in the switcher and on the trigger. */
  label: string;
  /** One-line description shown under the label in the switcher. */
  description: string;
  /** `[background, accent]` pair used to render the switcher swatch. */
  swatch: readonly [string, string];
  /** Font families this theme uses, for display in the switcher. */
  fonts: { heading: string; body: string };
  /** Maps to the CSS `color-scheme` property for native UI (scrollbars, etc.). */
  colorScheme: "light" | "dark";
}

export const THEMES: readonly ThemeDefinition[] = [
  {
    id: "light",
    label: "Light",
    description: "Teal over warm stone — the default practice look.",
    swatch: ["#ffffff", "#0f766e"],
    fonts: { heading: "Fraunces", body: "Geist" },
    colorScheme: "light",
  },
  {
    id: "soft",
    label: "Soft",
    description: "Cream and sage — warm, gentle, rounded.",
    swatch: ["#fbf8f3", "#6b8f71"],
    fonts: { heading: "Fraunces", body: "Nunito" },
    colorScheme: "light",
  },
  {
    id: "medical",
    label: "Medical",
    description: "Clinical blue and slate — crisp and trustworthy.",
    swatch: ["#ffffff", "#1d4ed8"],
    fonts: { heading: "Newsreader", body: "Manrope" },
    colorScheme: "light",
  },
  {
    id: "wellness",
    label: "Wellness",
    description: "Lavender and mint — airy and restorative.",
    swatch: ["#fbfaff", "#7c6bb0"],
    fonts: { heading: "Cormorant Garamond", body: "Karla" },
    colorScheme: "light",
  },
  {
    id: "sunrise",
    label: "Sunrise",
    description: "Terracotta and amber — cosy and human.",
    swatch: ["#fff9f2", "#c2593a"],
    fonts: { heading: "Fraunces", body: "Plus Jakarta Sans" },
    colorScheme: "light",
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep slate and soft teal — low-glare night mode.",
    swatch: ["#0b1115", "#5eead4"],
    fonts: { heading: "Fraunces", body: "Geist" },
    colorScheme: "dark",
  },
] as const;

/** The theme used when nothing is stored and no system preference is known. */
export const DEFAULT_THEME: ThemeId = "light";

/** The theme chosen when the OS reports a dark colour scheme. */
export const DARK_THEME: ThemeId = "midnight";

/** `localStorage` key holding the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "theraviva-theme";

/** All valid theme ids, used for validation and the inline script. */
export const THEME_IDS: readonly ThemeId[] = THEMES.map((theme) => theme.id);

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" && THEME_IDS.includes(value as ThemeId)
  );
}

/** Look a theme up by id, falling back to the default for unknown input. */
export function getTheme(id: unknown): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

/** Read the stored preference, ignoring absent or invalid values. */
export function getStoredTheme(): ThemeId | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(value) ? value : null;
  } catch {
    // Storage can throw in private mode or when blocked; treat as unset.
    return null;
  }
}

/** Persist an explicit choice. Failures (private mode, quota) are non-fatal. */
export function storeTheme(id: ThemeId): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // Ignore — the theme still applies for this session.
  }
}

/** Resolve the OS colour scheme to one of our themes. */
export function resolveSystemTheme(): ThemeId {
  if (typeof window === "undefined" || !window.matchMedia) {
    return DEFAULT_THEME;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_THEME
    : DEFAULT_THEME;
}

/** Stored choice if present, otherwise the system-derived theme. */
export function getInitialTheme(): ThemeId {
  return getStoredTheme() ?? resolveSystemTheme();
}

/**
 * Apply a theme to the document: set `data-theme` (drives the token overrides)
 * and `color-scheme` (drives native form controls and scrollbars).
 */
export function applyTheme(id: ThemeId): void {
  if (typeof document === "undefined") return;
  const theme = getTheme(id);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);
  root.style.colorScheme = theme.colorScheme;
}

/**
 * Inline, dependency-free script that applies the theme before first paint to
 * avoid a flash of the wrong theme. Rendered by `<ThemeScript />` as the first
 * element in `<body>`. Kept in sync with the helpers above via the injected
 * constants.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var ids=${JSON.stringify(THEME_IDS)};var t=window.localStorage.getItem(k);if(ids.indexOf(t)===-1){t=window.matchMedia("(prefers-color-scheme: dark)").matches?${JSON.stringify(
  DARK_THEME,
)}:${JSON.stringify(DEFAULT_THEME)};}var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=(t===${JSON.stringify(
  DARK_THEME,
)})?"dark":"light";}catch(e){}})();`;
