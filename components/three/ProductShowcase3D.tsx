"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";

const RiceBagScene = dynamic(
  () => import("./RiceBagScene").then((m) => m.RiceBagScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-secondary/50 rounded-2xl animate-pulse">
        <span className="text-muted-foreground text-sm">Loading 3D preview...</span>
      </div>
    ),
  }
);

type Props = {
  posterUrl?: string | null;
  productName: string;
};

export function ProductShowcase3D({ posterUrl, productName }: Props) {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setShow3d(!prefersReduced && !isMobile);
  }, []);

  if (!show3d) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rice/30 to-gold/20 flex items-center justify-center">
            <p className="font-display text-xl text-muted-foreground">
              {productName}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gold/20">
      <RiceBagScene className="w-full h-full min-h-[300px]" />
    </div>
  );
}
