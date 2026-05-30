"use client";

import Image from "next/image";
import { HERO_RICE_IMAGE } from "@/lib/rice-gallery-images";

/** Subtle fixed rice photo behind inner pages — same image as hero, no slideshow */
export function RicePhotoAmbience() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      <Image
        src={HERO_RICE_IMAGE.src}
        alt=""
        fill
        className="object-cover object-center opacity-[0.18]"
        sizes="100vw"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/90 via-[hsl(40_26%_96%/0.93)] to-cream/92" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(43_40%_88%/0.35),transparent_55%)]" />
    </div>
  );
}
