"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteProductImageAction } from "@/app/admin/media-actions";
import type { ProductImage } from "@/types/database";

export function ProductImageList({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const [pending, startTransition] = useTransition();

  if (images.length === 0) {
    return (
      <p className="text-sm" style={{ color: "#888" }}>
        No images yet. Upload above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          className="admin-card overflow-hidden relative group"
        >
          <div className="relative aspect-video">
            <Image
              src={img.url}
              alt={img.alt ?? "Product"}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await deleteProductImageAction(img.id, productId);
                window.location.reload();
              })
            }
            className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(220,38,38,0.9)", color: "#fff" }}
            title="Remove image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
