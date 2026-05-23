"use client";

import { useTransition } from "react";
import {
  toggleProductFeaturedAction,
  toggleProductPublishedAction,
} from "@/app/admin/actions";

export function ProductToggleButtons({
  productId,
  featured,
  published,
}: {
  productId: string;
  featured: boolean;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        className="admin-btn-outline"
        onClick={() =>
          startTransition(() => {
            void toggleProductFeaturedAction(productId);
          })
        }
      >
        {featured ? "Unfeature" : "Feature"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="admin-btn-outline"
        onClick={() =>
          startTransition(() => {
            void toggleProductPublishedAction(productId);
          })
        }
      >
        {published ? "Unpublish" : "Publish"}
      </button>
    </div>
  );
}
