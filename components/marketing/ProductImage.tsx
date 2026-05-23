"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { isRemoteProductImage } from "@/lib/product-images";

export function ProductImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-rice/15 to-gold/15 text-rice/70",
          className
        )}
      >
        <Package className="h-10 w-10" />
        <span className="text-xs font-medium px-2 text-center">Photo coming soon</span>
      </div>
    );
  }

  const remote = isRemoteProductImage(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      sizes={sizes}
      unoptimized={remote}
      onError={() => setFailed(true)}
    />
  );
}
