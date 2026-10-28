import type { MetadataRoute } from "next";

import { siteConfig } from "@/config";
import {
  albums,
  blogPosts,
  conditions,
  disciplines,
  locations,
  professionals,
} from "@/data";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface Entry {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  lastModified?: string;
}

/** Public, indexable routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, "");
  const now = new Date();

  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    ...disciplines.map((discipline) => ({
      path: `/services/${discipline.id}`,
      priority: 0.9,
      changeFrequency: "monthly" as ChangeFrequency,
    })),
    { path: "/conditions", priority: 0.9, changeFrequency: "monthly" },
    ...conditions.map((condition) => ({
      path: `/conditions/${condition.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as ChangeFrequency,
    })),
    { path: "/team", priority: 0.8, changeFrequency: "monthly" },
    ...professionals.map((professional) => ({
      path: `/team/${professional.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as ChangeFrequency,
    })),
    { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
    ...albums.map((album) => ({
      path: `/portfolio/${album.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as ChangeFrequency,
    })),
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.6,
      changeFrequency: "yearly" as ChangeFrequency,
      lastModified: post.date,
    })),
    ...locations.map((location) => ({
      path: `/locations/${location.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as ChangeFrequency,
    })),
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/referral", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/refund", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/disclaimer", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/accessibility", priority: 0.2, changeFrequency: "yearly" },
  ];

  return entries.map((entry) => ({
    url: `${base}${entry.path === "/" ? "" : entry.path}`,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
