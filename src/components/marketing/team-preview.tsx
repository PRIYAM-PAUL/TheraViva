import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge, Card, CardContent, MediaPlaceholder } from "@/components/ui";
import { getDiscipline, professionals } from "@/data";

/** Preview cards for the practice's specialists. */
export function TeamPreview() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {professionals.map((professional) => (
        <li key={professional.id}>
          <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lifted">
            <div className="grid grid-cols-[auto_1fr] gap-4 p-5">
              <MediaPlaceholder
                label={professional.name}
                discipline={professional.disciplines[0]}
                aspect="square"
                className="w-24"
              />
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {professional.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {professional.headline}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  {professional.disciplines.map((discipline) => (
                    <Badge key={discipline} variant="primary">
                      {getDiscipline(discipline)?.short ?? discipline}
                    </Badge>
                  ))}
                </p>
              </div>
            </div>
            <CardContent className="mt-auto space-y-3">
              <p className="text-sm text-pretty text-muted-foreground">
                {professional.summary}
              </p>
              <Link
                href={`/team/${professional.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View profile
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
