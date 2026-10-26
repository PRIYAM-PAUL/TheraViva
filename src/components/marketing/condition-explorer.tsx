"use client";

import Link from "next/link";

import { Tab, TabList, TabPanel, Tabs } from "@/components/ui";
import { conditions } from "@/data/conditions";
import type { AgeGroup } from "@/types";

const groups: { value: string; label: string; matches: AgeGroup[] }[] = [
  { value: "all", label: "All conditions", matches: ["child", "adult", "all"] },
  { value: "child", label: "For children", matches: ["child", "all"] },
  { value: "adult", label: "For adults", matches: ["adult", "all"] },
];

/** Filterable list of condition pages, grouped by age. */
export function ConditionExplorer() {
  return (
    <Tabs defaultValue="all" className="flex flex-col gap-6">
      <TabList className="mx-auto">
        {groups.map((group) => (
          <Tab key={group.value} value={group.value}>
            {group.label}
          </Tab>
        ))}
      </TabList>

      {groups.map((group) => (
        <TabPanel key={group.value} value={group.value}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {conditions
              .filter((condition) => group.matches.includes(condition.ageGroup))
              .map((condition) => (
                <li key={condition.slug}>
                  <Link
                    href={`/conditions/${condition.slug}`}
                    className="flex h-full flex-col gap-1.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="font-medium text-foreground">
                      {condition.shortTitle}
                    </span>
                    <span className="text-sm text-pretty text-muted-foreground">
                      {condition.summary}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </TabPanel>
      ))}
    </Tabs>
  );
}
