import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, CtaBand } from "@/components/marketing";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buttonVariants,
  Container,
  MediaGallery,
  Section,
} from "@/components/ui";
import { albums, getAlbumBySlug, getMediaForAlbum, portfolioDisclaimer } from "@/data";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return albums.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/portfolio/[album]">) {
  const { album: slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album)
    return buildMetadata({ title: "Not found", description: "", path: "/portfolio" });

  return buildMetadata({
    title: album.title,
    description: album.description,
    path: `/portfolio/${album.slug}`,
  });
}

export default async function AlbumPage({
  params,
}: PageProps<"/portfolio/[album]">) {
  const { album: slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  const media = getMediaForAlbum(album);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: album.title, path: `/portfolio/${album.slug}` },
  ];

  return (
    <>
      <Section spacing="lg">
        <Container className="space-y-8">
          <Breadcrumbs items={crumbs} />

          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {album.title}
            </h1>
            <p className="max-w-prose text-pretty text-muted-foreground">
              {album.description}
            </p>
          </div>

          <MediaGallery assets={media} />

          <p className="text-xs text-muted-foreground">{portfolioDisclaimer}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All collections
            </Link>
            <Link href="/book" className={buttonVariants({})}>
              Request an appointment
            </Link>
          </div>
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
