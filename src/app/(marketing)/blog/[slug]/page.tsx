import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, CtaBand } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Badge,
  Card,
  CardContent,
  Container,
  MediaPlaceholder,
  Prose,
  Section,
} from "@/components/ui";
import {
  blogPosts,
  getConditionBySlug,
  getPostBySlug,
  getProfessionalById,
  getServiceBySlug,
} from "@/data";
import { formatDateLong, parseDateKey } from "@/lib/format";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Not found", description: "", path: "/blog" });

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getProfessionalById(post.authorId);
  const related = post.related
    .map((relatedSlug) => {
      const condition = getConditionBySlug(relatedSlug);
      if (condition) return { href: `/conditions/${condition.slug}`, label: condition.shortTitle };
      const service = getServiceBySlug(relatedSlug);
      if (service) return { href: `/services/${service.discipline}`, label: service.title };
      return null;
    })
    .filter((item): item is { href: string; label: string } => item !== null);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container size="md" className="space-y-8">
          <Breadcrumbs items={crumbs} />

          <header className="space-y-4">
            <Badge variant="primary">{post.category}</Badge>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {post.title}
            </h1>
            <p className="text-lg text-pretty text-muted-foreground">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                {formatDateLong(parseDateKey(post.date))}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
              {author ? <span>By {author.name}</span> : null}
            </div>
          </header>

          <MediaPlaceholder
            label={post.title}
            discipline={author?.disciplines[0]}
            aspect="wide"
          />

          <Prose>
            {post.sections.map((section, index) => (
              <section key={index}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.quote ? (
                  <blockquote className="mt-6 border-l-4 border-primary/40 pl-5 font-display text-lg italic text-foreground">
                    {section.quote}
                  </blockquote>
                ) : null}
              </section>
            ))}
          </Prose>

          {related.length > 0 ? (
            <div className="space-y-3 border-t border-border pt-8">
              <h2 className="font-display text-lg font-semibold">
                Related on this site
              </h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
                    >
                      {item.label}
                      <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {author ? (
            <Card>
              <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                <MediaPlaceholder
                  label={author.name}
                  discipline={author.disciplines[0]}
                  aspect="square"
                  className="w-20"
                />
                <div className="space-y-1.5">
                  <p className="font-medium text-foreground">{author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {author.headline}
                  </p>
                  <Link
                    href={`/team/${author.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View profile
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <p className="text-xs text-muted-foreground">
            This article is general information for education. It is not a
            diagnosis and does not replace individual assessment by a qualified
            professional.
          </p>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <CtaBand />
        </Container>
      </Section>

      <JsonLd data={[breadcrumbJsonLd(crumbs), articleJsonLd(post)]} />
    </>
  );
}
