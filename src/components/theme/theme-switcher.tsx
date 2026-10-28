"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, Palette } from "lucide-react";
import * as React from "react";

import { useTheme } from "@/components/theme/theme-provider";
import { buttonVariants } from "@/components/ui";
import type { ThemeId } from "@/lib/theme";
import { cn } from "@/lib/utils";

export interface ThemeSwitcherProps {
  className?: string;
  /** Show the active theme's name beside the icon. Defaults to `true`. */
  showLabel?: boolean;
  /** Which edge the popup aligns to. Defaults to `end`. */
  align?: "start" | "center" | "end";
}

/**
 * Theme picker for the site header.
 *
 * A Base UI radio menu: the trigger shows the active theme, and the popup lists
 * every theme as a `menuitemradio` with a palette swatch, the fonts it uses,
 * and a check on the current selection. Fully keyboard-navigable.
 */
export function ThemeSwitcher({
  className,
  showLabel = true,
  align = "end",
}: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme();
  const active = themes.find((item) => item.id === theme) ?? themes[0];

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Change theme. Current theme: ${active.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2",
          className,
        )}
      >
        <Palette className="size-4" aria-hidden="true" />
        {showLabel ? (
          <span className="hidden sm:inline">{active.label}</span>
        ) : null}
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align={align} className="z-50">
          <Menu.Popup
            className={cn(
              "w-72 origin-[var(--transform-origin)] rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lifted outline-none",
              "transition-[transform,opacity] data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            )}
          >
            <Menu.RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as ThemeId)}
            >
              <Menu.GroupLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Appearance
              </Menu.GroupLabel>

              {themes.map((item) => (
                <Menu.RadioItem
                  key={item.id}
                  value={item.id}
                  closeOnClick
                  className={cn(
                    "grid cursor-default select-none grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 outline-none",
                    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-6 shrink-0 rounded-full border border-border shadow-soft"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${item.swatch[0]} 0 50%, ${item.swatch[1]} 50% 100%)`,
                    }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium leading-tight">
                      {item.label}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground/80">
                      {item.fonts.heading} · {item.fonts.body}
                    </span>
                  </span>
                  <Menu.RadioItemIndicator className="text-primary">
                    <Check className="size-4" aria-hidden="true" />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
