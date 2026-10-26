import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants, MediaMarquee, Marquee } from "@/components/ui";
import { mediaAssets } from "@/data/portfolio";
import { professionals } from "@/data/professionals";

const keywords = Array.from(
  new Set(professionals.flatMap((professional) => professional.skills)),
);

/** Auto-scrolling portfolio strip with a scrolling keyword band. */
export function PortfolioPreview() {
  if (mediaAssets.length === 0) return null;

  return (
    <div className="space-y-8">
      <MediaMarquee assets={mediaAssets} durationSeconds={70} />
      <Marquee items={keywords} />
      <div className="flex justify-center">
        <Link href="/portfolio" className={buttonVariants({ variant: "outline" })}>
          View the full portfolio
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
