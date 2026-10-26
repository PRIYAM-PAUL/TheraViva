import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui";
import { getDiscipline, testimonials } from "@/data";

/**
 * Renders nothing while there are no consented testimonials. Client reviews are
 * never invented — the section appears once real ones are added to
 * `@/data/testimonials`.
 */
export function TestimonialWall() {
  if (testimonials.length === 0) return null;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id}>
          <Card className="flex h-full flex-col">
            <CardContent className="flex flex-1 flex-col gap-4 pt-6">
              <div
                className="flex gap-0.5"
                aria-label={`Rated ${testimonial.rating} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < testimonial.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-muted-foreground/30"
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-sm text-pretty text-foreground/90">
                “{testimonial.body}”
              </blockquote>
              <footer className="text-sm">
                <p className="font-medium text-foreground">{testimonial.author}</p>
                <p className="text-muted-foreground">
                  {testimonial.relation}
                  {testimonial.discipline
                    ? ` · ${getDiscipline(testimonial.discipline)?.short ?? ""}`
                    : ""}
                </p>
              </footer>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
