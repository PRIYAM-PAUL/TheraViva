import * as React from "react";

import { cn } from "@/lib/utils";

export interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * An infinitely scrolling ticker. The track is duplicated so the animation
 * loops seamlessly; `aria-hidden` on the duplicate keeps it out of the
 * accessibility tree.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const track = (
    <ul className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 whitespace-nowrap text-sm font-medium text-muted-foreground"
        >
          {item}
          <span aria-hidden="true" className="text-primary/40">
            ●
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div className="flex animate-marquee motion-reduce:animate-none">
        {track}
        <div aria-hidden="true" className="flex">
          {track}
        </div>
      </div>
    </div>
  );
}
