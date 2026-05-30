"use client";

import Image from "next/image";
import { HERO_RICE_IMAGE } from "@/lib/rice-gallery-images";
import { cn } from "@/lib/utils";

/** Static hero background — single rice image (no rotation). */
export function RiceHeroSlideshow() {
  const needsDarkText = HERO_RICE_IMAGE.heroTextTheme === "dark";

  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src={HERO_RICE_IMAGE.src}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
      />
      <div
        className={cn(
          "absolute inset-0",
          needsDarkText
            ? "bg-gradient-to-r from-cream/88 via-cream/72 to-charcoal/40"
            : "bg-gradient-to-r from-charcoal/75 via-charcoal/55 to-charcoal/35"
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          needsDarkText
            ? "bg-gradient-to-t from-cream/75 via-transparent to-cream/30"
            : "bg-gradient-to-t from-charcoal/65 via-transparent to-charcoal/20"
        )}
      />
    </div>
  );
}
