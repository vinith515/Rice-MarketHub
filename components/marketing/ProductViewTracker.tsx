"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent("product_view", { product_id: productId });
  }, [productId]);

  return null;
}
