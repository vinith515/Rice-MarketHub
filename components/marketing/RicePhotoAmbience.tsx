"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RICE_SLIDESHOW_IMAGES } from "@/lib/rice-gallery-images";
import { cn } from "@/lib/utils";

/** Site-wide sliding rice photos — lightly visible behind all pages */
export function RicePhotoAmbience() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const images = RICE_SLIDESHOW_IMAGES;

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 8000);
    return () => clearInterval(t);
  }, [reduceMotion, images.length]);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {images.map((img, i) => (
        <div
          key={img.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-[2800ms] ease-in-out",
            i === index ? "opacity-[0.2]" : "opacity-0"
          )}
        >
          <Image
            src={img.src}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-cream/90 via-[hsl(40_26%_96%/0.93)] to-cream/92" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,hsl(43_40%_88%/0.35),transparent_55%)]" />
    </div>
  );
}
