import type { Product } from "@/types/database";

const STOCK_PLACEHOLDER = /^\/rice\//;

/** Prefer admin-uploaded Supabase URLs over default stock photos in /public/rice */
export function pickProductImageUrl(product: Product): string | undefined {
  const images = [...(product.images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  if (images.length === 0) return undefined;

  const uploaded = images.find(
    (img) =>
      img.url &&
      (img.url.includes("supabase.co") || img.url.includes("supabase.in"))
  );
  if (uploaded?.url) return uploaded.url;

  const custom = images.find(
    (img) => img.url && !STOCK_PLACEHOLDER.test(img.url)
  );
  if (custom?.url) return custom.url;

  return images[0]?.url;
}

export function isRemoteProductImage(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
