"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

/** Styled Base UI tabs. Keyboard-navigable, with a visible focus ring. */
export const Tabs = BaseTabs.Root;

export function TabList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn(
        "flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1",
        className,
      )}
      {...props}
    />
  );
}

export function Tab({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabPanel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    />
  );
}
