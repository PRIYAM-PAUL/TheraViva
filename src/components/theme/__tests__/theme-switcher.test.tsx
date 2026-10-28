import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, ThemeSwitcher } from "@/components/theme";
import { THEMES, THEME_STORAGE_KEY } from "@/lib/theme";

function renderSwitcher() {
  return render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>,
  );
}

/** The trigger is the only button in this isolated tree. */
function getTrigger(): HTMLElement {
  return screen.getByRole("button", { name: /change theme/i });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ThemeSwitcher", () => {
  it("shows the active theme on the trigger", () => {
    renderSwitcher();
    expect(getTrigger()).toHaveAccessibleName(/current theme: light/i);
  });

  it("opens a menu listing every theme as a radio item", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(getTrigger());

    const items = await screen.findAllByRole("menuitemradio");
    expect(items).toHaveLength(THEMES.length);
    for (const theme of THEMES) {
      // Anchor to the label so descriptions ("soft teal" etc.) can't collide.
      expect(
        await screen.findByRole("menuitemradio", {
          name: new RegExp(`^${theme.label}`),
        }),
      ).toBeInTheDocument();
    }
  });

  it("marks the current theme as checked", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(getTrigger());

    expect(
      await screen.findByRole("menuitemradio", { name: /^light/i }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("menuitemradio", { name: /^soft/i }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("applies and persists the chosen theme", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(getTrigger());
    await user.click(
      await screen.findByRole("menuitemradio", { name: /^midnight/i }),
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "midnight");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("midnight");
    expect(getTrigger()).toHaveAccessibleName(/current theme: midnight/i);
  });

  it("describes each theme with its fonts", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(getTrigger());

    const wellness = await screen.findByRole("menuitemradio", {
      name: /^wellness/i,
    });
    expect(
      within(wellness).getByText(/Cormorant Garamond · Karla/),
    ).toBeInTheDocument();
  });
});
