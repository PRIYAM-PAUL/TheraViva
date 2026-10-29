"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { AuthGuard, PageHeader } from "@/components/dashboard";
import { Card, CardContent, Input } from "@/components/ui";
import { faqs } from "@/data";
import { cn } from "@/lib/utils";

function PatientHelp() {
  const [query, setQuery] = React.useState("");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(needle) ||
        faq.answer.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Help & frequently asked questions"
        description="Quick answers about booking, sessions, fees and privacy."
      />

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          aria-label="Search frequently asked questions"
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No questions match “{query}”. Try a different search, or message the
              clinic from the Messages page.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((faq, index) => {
                const open = openIndex === index;
                return (
                  <li key={faq.question}>
                    <h2>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenIndex(open ? null : index)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground"
                      >
                        {faq.question}
                        <span
                          className={cn(
                            "shrink-0 text-muted-foreground transition-transform",
                            open && "rotate-45",
                          )}
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </button>
                    </h2>
                    {open ? (
                      <p className="pb-4 text-sm text-muted-foreground">{faq.answer}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PatientHelpPage() {
  return (
    <AuthGuard requireRoles={["patient"]}>
      <PatientHelp />
    </AuthGuard>
  );
}
