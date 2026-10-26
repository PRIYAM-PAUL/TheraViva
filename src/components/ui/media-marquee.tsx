"use client";

import * as React from "react";

import { MediaFrame } from "@/components/ui/media";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types";

export interface MediaMarqueeProps {
  assets: MediaAsset[];
  /** Seconds for one full loop. Lower = faster. */
  durationSeconds?: number;
  /** Scroll right-to-left by default; set `true` to reverse. */
  reverse?: boolean;
  /** Card width utility. Defaults to a comfortable photo width. */
  itemClassName?: string;
  className?: string;
}

/**
 * A continuously auto-scrolling strip of media.
 *
 * The track is rendered twice and translated by -50%, so the loop is seamless.
 * The duplicate is `aria-hidden`, animation pauses on hover/focus, and it is
 * disabled entirely under `prefers-reduced-motion`.
 */
export function MediaMarquee({
  assets,
  durationSeconds = 48,
  reverse = false,
  itemClassName = "w-64 sm:w-72",
  className,
}: MediaMarqueeProps) {
  if (assets.length === 0) return null;

  const track = (duplicate: boolean) => (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 gap-4 pr-4"
    >
      {assets.map((asset) => (
        <li key={asset.id} className={cn("shrink-0", itemClassName)}>
          <MediaFrame asset={asset} showCaption controls={false} />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex animate-marquee",
          "group-hover:[animation-play-state:paused]",
          "group-focus-within:[animation-play-state:paused]",
          "motion-reduce:animate-none",
        )}
        style={{
          animationDuration: `${durationSeconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
