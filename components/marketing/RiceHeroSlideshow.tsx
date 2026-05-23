"use client";

import { useEffect } from "react";
import Image from "next/image";
import { HERO_RICE_IMAGES } from "@/lib/rice-gallery-images";
import { cn } from "@/lib/utils";

type Props = {
  activeIndex: number;
  onActiveIndexChange: React.Dispatch<React.SetStateAction<number>>;
};

export function RiceHeroSlideshow({ activeIndex, onActiveIndexChange }: Props) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || HERO_RICE_IMAGES.length < 2) return;

    const t = setInterval(() => {
      onActiveIndexChange((i) => (i + 1) % HERO_RICE_IMAGES.length);
    }, 7000);
    return () => clearInterval(t);
  }, [onActiveIndexChange]);

  const slide = HERO_RICE_IMAGES[activeIndex];
  const needsDarkText = slide?.heroTextTheme === "dark";

  return (
    <div className="absolute inset-0" aria-hidden>
      {HERO_RICE_IMAGES.map((img, i) => (
        <div
          key={img.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-[2400ms] ease-in-out",
            i === activeIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={img.src}
            alt=""
            fill
            priority={i === 0}
            className="object-cover object-[center_35%]"
            sizes="100vw"
            unoptimized
          />
        </div>
      ))}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-[2400ms]",
          needsDarkText
            ? "bg-gradient-to-r from-cream/88 via-cream/72 to-charcoal/40"
            : "bg-gradient-to-r from-charcoal/92 via-charcoal/78 to-charcoal/45"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-[2400ms]",
          needsDarkText
            ? "bg-gradient-to-t from-cream/75 via-transparent to-cream/30"
            : "bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/25"
        )}
      />
    </div>
  );
}
