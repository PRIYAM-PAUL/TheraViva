import { ImageIcon, Play } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Discipline, MediaAsset } from "@/types";

const disciplineStyle: Record<
  Discipline,
  { label: string; gradient: string; chip: string }
> = {
  "occupational-therapy": {
    label: "Occupational Therapy",
    gradient: "from-teal-500/20 via-teal-500/5 to-amber-400/15",
    chip: "bg-teal-600/10 text-teal-700 dark:text-teal-300",
  },
  "speech-language": {
    label: "Speech & Language",
    gradient: "from-amber-500/20 via-amber-400/5 to-teal-500/15",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  audiology: {
    label: "Audiology",
    gradient: "from-indigo-500/20 via-indigo-400/5 to-teal-500/15",
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  },
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/10]",
} as const;

export interface MediaFrameProps {
  asset: MediaAsset;
  aspect?: keyof typeof aspectClass;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Show the caption beneath the frame. */
  showCaption?: boolean;
  /**
   * Render video controls. Set `false` for decorative contexts such as the
   * auto-scrolling marquee, where the frame is not the primary interaction.
   */
  controls?: boolean;
}

/**
 * Renders a photo or video. When no real asset has been supplied yet, a
 * branded placeholder is shown instead of a broken image — so the layout is
 * honest about what is still to come.
 */
export function MediaFrame({
  asset,
  aspect = "video",
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  showCaption = false,
  controls = true,
}: MediaFrameProps) {
  const style = asset.discipline ? disciplineStyle[asset.discipline] : null;

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-xl border border-border bg-muted",
          aspectClass[aspect],
        )}
      >
        {asset.src ? (
          asset.kind === "image" ? (
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
            />
          ) : (
            <video
              src={asset.src}
              poster={asset.poster}
              controls={controls}
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          )
        ) : (
          <div
            className={cn(
              "flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br p-6 text-center",
              style?.gradient ?? "from-muted via-muted to-muted",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-background/70 text-muted-foreground backdrop-blur">
              {asset.kind === "video" ? (
                <Play className="size-5" aria-hidden="true" />
              ) : (
                <ImageIcon className="size-5" aria-hidden="true" />
              )}
            </span>
            <p className="max-w-[22ch] text-sm font-medium text-foreground/80">
              {asset.alt}
            </p>
            {style ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  style.chip,
                )}
              >
                {style.label}
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {asset.kind === "video" ? "Video coming soon" : "Photo coming soon"}
            </span>
          </div>
        )}
      </div>

      {showCaption && asset.caption ? (
        <figcaption className="text-sm text-muted-foreground">
          {asset.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export interface MediaPlaceholderProps {
  label: string;
  discipline?: Discipline;
  kind?: "image" | "video";
  aspect?: keyof typeof aspectClass;
  className?: string;
}

/** Standalone branded placeholder, for slots without an authored asset. */
export function MediaPlaceholder({
  label,
  discipline,
  kind = "image",
  aspect = "video",
  className,
}: MediaPlaceholderProps) {
  const style = discipline ? disciplineStyle[discipline] : null;
  return (
    <div
      className={cn(
        "relative isolate flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border bg-gradient-to-br p-6 text-center",
        style?.gradient ?? "from-muted via-muted to-muted",
        aspectClass[aspect],
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-background/70 text-muted-foreground backdrop-blur">
        {kind === "video" ? (
          <Play className="size-5" aria-hidden="true" />
        ) : (
          <ImageIcon className="size-5" aria-hidden="true" />
        )}
      </span>
      <p className="max-w-[24ch] text-sm font-medium text-foreground/80">
        {label}
      </p>
      <span className="text-xs text-muted-foreground">
        {kind === "video" ? "Video coming soon" : "Photo coming soon"}
      </span>
    </div>
  );
}
