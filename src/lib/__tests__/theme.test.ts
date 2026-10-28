import { afterEach, describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  DARK_THEME,
  DEFAULT_THEME,
  getInitialTheme,
  getStoredTheme,
  getTheme,
  isThemeId,
  resolveSystemTheme,
  storeTheme,
  THEME_IDS,
  THEME_STORAGE_KEY,
  THEMES,
  themeInitScript,
} from "@/lib/theme";

/** Replace `matchMedia` so system-preference logic can be driven per test. */
function mockMatchMedia(matches: boolean): void {
  window.matchMedia = ((query: string) =>
    ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
});

describe("theme registry", () => {
  it("exposes the six shipped themes with unique ids", () => {
    expect(THEMES).toHaveLength(6);
    const ids = THEMES.map((theme) => theme.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "light",
      "soft",
      "medical",
      "wellness",
      "sunrise",
      "midnight",
    ]);
  });

  it("includes the default theme and keeps THEME_IDS in sync", () => {
    expect(THEME_IDS).toEqual(THEMES.map((theme) => theme.id));
    expect(THEME_IDS).toContain(DEFAULT_THEME);
    expect(THEME_IDS).toContain(DARK_THEME);
  });

  it("gives every theme the fields the UI relies on", () => {
    for (const theme of THEMES) {
      expect(theme.label).toBeTruthy();
      expect(theme.description).toBeTruthy();
      expect(theme.swatch).toHaveLength(2);
      expect(theme.fonts.heading).toBeTruthy();
      expect(theme.fonts.body).toBeTruthy();
      expect(["light", "dark"]).toContain(theme.colorScheme);
    }
  });

  it("marks only midnight as a dark theme", () => {
    const dark = THEMES.filter((theme) => theme.colorScheme === "dark");
    expect(dark.map((theme) => theme.id)).toEqual(["midnight"]);
  });
});

describe("isThemeId", () => {
  it("accepts known ids and rejects everything else", () => {
    expect(isThemeId("soft")).toBe(true);
    expect(isThemeId("midnight")).toBe(true);
    expect(isThemeId("sepia")).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId(42)).toBe(false);
  });
});

describe("getTheme", () => {
  it("returns the matching definition", () => {
    expect(getTheme("wellness").label).toBe("Wellness");
    expect(getTheme("medical").fonts.body).toBe("Manrope");
  });

  it("falls back to the default for unknown input", () => {
    expect(getTheme("nope").id).toBe(THEMES[0].id);
    expect(getTheme(undefined).id).toBe(THEMES[0].id);
  });
});

describe("applyTheme", () => {
  it("sets data-theme and the matching color-scheme", () => {
    applyTheme("midnight");
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "midnight",
    );
    expect(document.documentElement.style.colorScheme).toBe("dark");

    applyTheme("soft");
    expect(document.documentElement.getAttribute("data-theme")).toBe("soft");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });
});

describe("storage", () => {
  it("returns null when nothing valid is stored", () => {
    expect(getStoredTheme()).toBeNull();
    window.localStorage.setItem(THEME_STORAGE_KEY, "not-a-theme");
    expect(getStoredTheme()).toBeNull();
  });

  it("round-trips a stored theme", () => {
    storeTheme("sunrise");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("sunrise");
    expect(getStoredTheme()).toBe("sunrise");
  });

  it("degrades gracefully when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getStoredTheme()).toBeNull();
  });
});

describe("system preference", () => {
  it("resolves dark schemes to midnight and light to the default", () => {
    mockMatchMedia(true);
    expect(resolveSystemTheme()).toBe(DARK_THEME);
    mockMatchMedia(false);
    expect(resolveSystemTheme()).toBe(DEFAULT_THEME);
  });

  it("prefers a stored choice over the system preference", () => {
    mockMatchMedia(true);
    expect(getInitialTheme()).toBe(DARK_THEME);

    storeTheme("wellness");
    expect(getInitialTheme()).toBe("wellness");
  });
});

describe("themeInitScript", () => {
  it("is a self-contained script carrying the key and ids", () => {
    expect(themeInitScript).toContain(THEME_STORAGE_KEY);
    for (const id of THEME_IDS) {
      expect(themeInitScript).toContain(id);
    }
    expect(themeInitScript).toContain("data-theme");
    expect(themeInitScript.startsWith("(function(){")).toBe(true);
  });
});
