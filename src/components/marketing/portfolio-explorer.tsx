"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Badge,
  Card,
  CardContent,
  MediaGallery,
  MediaMarquee,
  MediaPlaceholder,
  Marquee,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/ui";
import { getDiscipline } from "@/data/disciplines";
import { albums, getMediaForAlbum, mediaAssets, portfolioDisclaimer } from "@/data/portfolio";
import { professionals } from "@/data/professionals";
import { cn } from "@/lib/utils";
import type { Discipline, MediaAsset } from "@/types";

interface DoctorTab {
  value: string;
  name: string;
  role: string;
  /** Disciplines used to filter albums. `null` = everything. */
  disciplines: Discipline[] | null;
  keywords: string[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const allKeywords = Array.from(
  new Set(professionals.flatMap((professional) => professional.skills)),
);

const doctorTabs: DoctorTab[] = [
  {
    value: "all",
    name: "All work",
    role: "Occupational therapy · Speech & language · Audiology",
    disciplines: null,
    keywords: allKeywords,
  },
  ...professionals.map((professional) => ({
    value: professional.id,
    name: professional.name,
    role: professional.headline,
    disciplines: professional.disciplines,
    keywords: professional.skills,
  })),
];

function mediaFor(tab: DoctorTab): MediaAsset[] {
  if (!tab.disciplines) return mediaAssets;
  return mediaAssets.filter(
    (asset) =>
      asset.professionalId === tab.value ||
      (asset.discipline !== undefined &&
        tab.disciplines?.includes(asset.discipline)),
  );
}

function albumsFor(tab: DoctorTab) {
  if (!tab.disciplines) return albums;
  return albums.filter(
    (album) => album.discipline && tab.disciplines?.includes(album.discipline),
  );
}

/**
 * Portfolio explorer: a doctor "navbar" that filters the media marquee, the
 * scrolling keyword band, the collections and the full gallery.
 */
export function PortfolioExplorer() {
  return (
    <Tabs defaultValue="all" className="flex flex-col gap-10">
      <TabList
        aria-label="Filter portfolio by specialist"
        className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap"
      >
        {doctorTabs.map((tab) => {
          const isAll = tab.value === "all";
          return (
            <Tab
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left sm:flex-none",
                "data-[selected]:border-primary/40 data-[selected]:bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isAll
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground",
                )}
                aria-hidden="true"
              >
                {isAll ? "All" : initials(tab.name)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  {tab.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {tab.role}
                </span>
              </span>
            </Tab>
          );
        })}
      </TabList>

      {doctorTabs.map((tab) => {
        const media = mediaFor(tab);
        const tabAlbums = albumsFor(tab);

        return (
          <TabPanel key={tab.value} value={tab.value} className="space-y-10">
            <MediaMarquee assets={media} durationSeconds={media.length > 8 ? 60 : 40} />

            <Marquee items={tab.keywords} />

            {tabAlbums.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {tabAlbums.map((album) => {
                  const albumMedia = getMediaForAlbum(album);
                  return (
                    <li key={album.slug}>
                      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lifted">
                        {albumMedia[0] ? (
                          <MediaPlaceholder
                            label={album.title}
                            discipline={album.discipline}
                            aspect="video"
                            className="rounded-none border-0 border-b"
                          />
                        ) : null}
                        <CardContent className="flex flex-1 flex-col gap-3 pt-6">
                          {album.discipline ? (
                            <Badge variant="primary">
                              {getDiscipline(album.discipline)?.short ?? ""}
                            </Badge>
                          ) : null}
                          <h3 className="font-display text-lg font-semibold tracking-tight">
                            {album.title}
                          </h3>
                          <p className="text-sm text-pretty text-muted-foreground">
                            {album.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {albumMedia.length} items
                          </p>
                          <Link
                            href={`/portfolio/${album.slug}`}
                            className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                          >
                            Open collection
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {tab.value === "all" ? "Everything" : `${tab.name}'s work`}
              </h3>
              <MediaGallery assets={media} />
            </div>

            <p className="text-xs text-muted-foreground">{portfolioDisclaimer}</p>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
