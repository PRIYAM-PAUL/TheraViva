import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "@/components/theme";
import { THEMES, THEME_STORAGE_KEY } from "@/lib/theme";

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

function Probe() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="count">{themes.length}</span>
      <button type="button" onClick={() => setTheme("wellness")}>
        set wellness
      </button>
      <button type="button" onClick={() => setTheme("midnight")}>
        set midnight
      </button>
    </div>
  );
}

function renderProbe() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ThemeProvider", () => {
  it("exposes every theme to consumers", () => {
    renderProbe();
    expect(screen.getByTestId("count")).toHaveTextContent(
      String(THEMES.length),
    );
  });

  it("defaults to the light theme and applies it to the document", () => {
    mockMatchMedia(false);
    renderProbe();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("uses a persisted choice on first render", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sunrise");
    renderProbe();
    expect(screen.getByTestId("theme")).toHaveTextContent("sunrise");
    expect(document.documentElement).toHaveAttribute("data-theme", "sunrise");
  });

  it("follows the OS dark scheme when nothing is stored", () => {
    mockMatchMedia(true);
    renderProbe();
    expect(screen.getByTestId("theme")).toHaveTextContent("midnight");
    expect(document.documentElement).toHaveAttribute("data-theme", "midnight");
  });

  it("applies and persists an explicit selection", async () => {
    const user = userEvent.setup();
    mockMatchMedia(false);
    renderProbe();

    await user.click(screen.getByRole("button", { name: "set wellness" }));

    expect(screen.getByTestId("theme")).toHaveTextContent("wellness");
    expect(document.documentElement).toHaveAttribute("data-theme", "wellness");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("wellness");
  });

  it("switches between themes and tracks the dark color-scheme", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "set midnight" }));
    expect(document.documentElement.style.colorScheme).toBe("dark");

    await user.click(screen.getByRole("button", { name: "set wellness" }));
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("throws when useTheme is used outside a provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow(
      /useTheme must be used within a <ThemeProvider>/,
    );

    error.mockRestore();
  });
});
