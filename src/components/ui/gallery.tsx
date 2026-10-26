"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";

import { MediaFrame } from "@/components/ui/media";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types";

export interface MediaGalleryProps {
  assets: MediaAsset[];
  className?: string;
}

/**
 * A responsive media grid with a keyboard-accessible lightbox.
 * Arrow keys move between items; Escape closes (handled by Base UI Dialog).
 */
export function MediaGallery({ assets, className }: MediaGalleryProps) {
  const [index, setIndex] = React.useState<number | null>(null);
  const open = index !== null;
  const current = open ? assets[index] : null;

  const move = React.useCallback(
    (delta: number) => {
      setIndex((previous) => {
        if (previous === null || assets.length === 0) return previous;
        return (previous + delta + assets.length) % assets.length;
      });
    },
    [assets.length],
  );

  if (assets.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Media for this collection is coming soon.
      </p>
    );
  }

  return (
    <>
      <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {assets.map((asset, itemIndex) => (
          <li key={asset.id}>
            <button
              type="button"
              onClick={() => setIndex(itemIndex)}
              aria-label={`Open ${asset.kind === "video" ? "video" : "image"}: ${asset.alt}`}
              className="group block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <MediaFrame
                asset={asset}
                showCaption
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </li>
        ))}
      </ul>

      <BaseDialog.Root
        open={open}
        onOpenChange={(next) => setIndex(next ? (index ?? 0) : null)}
      >
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
          <BaseDialog.Popup
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") move(1);
              if (event.key === "ArrowLeft") move(-1);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 focus-visible:outline-none sm:p-8"
          >
            <BaseDialog.Title className="sr-only">
              Media viewer
            </BaseDialog.Title>

            {current ? (
              <div className="flex w-full max-w-4xl flex-col gap-3">
                <MediaFrame asset={current} aspect="video" showCaption />

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-2 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Previous
                  </button>

                  <span className="text-sm text-stone-200">
                    {(index ?? 0) + 1} / {assets.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => move(1)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-2 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Next
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : null}

            <BaseDialog.Close
              aria-label="Close viewer"
              className="absolute right-4 top-4 rounded-lg bg-background/90 p-2 text-foreground shadow-soft transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" aria-hidden="true" />
            </BaseDialog.Close>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}
