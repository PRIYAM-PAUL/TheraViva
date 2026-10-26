import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";

import { Breadcrumbs, CtaBand, SectionHeading } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge, Card, CardContent, Container, Section } from "@/components/ui";
import { getProfessionalById, sortedPosts } from "@/data";
import { formatDateLong, parseDateKey } from "@/lib/format";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Practical, plain-language articles on occupational therapy, speech and language development, sensory processing and hearing — written by our specialists.",
  path: "/blog",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

export default function BlogPage() {
  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-10">
          <div className="space-y-6">
            <Breadcrumbs items={crumbs} />
            <SectionHeading
              align="left"
              eyebrow="Blog"
              title="Guidance you can actually use"
              description="Written by our therapists for parents and caregivers. General information — never a substitute for individual assessment."
            />
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => {
              const author = getProfessionalById(post.authorId);
              return (
                <li key={post.slug}>
                  <Card className="flex h-full flex-col transition-shadow hover:shadow-lifted">
                    <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                      <Badge variant="primary">{post.category}</Badge>
                      <h2 className="font-display text-lg font-semibold tracking-tight">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="underline-offset-4 hover:text-primary hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-pretty text-muted-foreground">
                        {post.description}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" aria-hidden="true" />
                          {formatDateLong(parseDateKey(post.date))}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {post.readingMinutes} min read
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {author ? `By ${author.name}` : ""}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Read article
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
