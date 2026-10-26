import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge, Card, CardContent } from "@/components/ui";
import { disciplines, getConditionsByDiscipline } from "@/data";

/** The three disciplines as cards. */
export function ServicesShowcase() {
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {disciplines.map((discipline) => {
        const Icon = discipline.icon;
        const related = getConditionsByDiscipline(discipline.id).slice(0, 4);
        return (
          <li key={discipline.id}>
            <Card className="flex h-full flex-col transition-shadow hover:shadow-lifted">
              <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {discipline.title}
                </h3>
                <p className="text-sm text-pretty text-muted-foreground">
                  {discipline.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {related.map((condition) => (
                    <Badge key={condition.slug} variant="neutral">
                      {condition.shortTitle}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={`/services/${discipline.id}`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Explore {discipline.short}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
