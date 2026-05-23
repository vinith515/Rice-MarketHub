/** Primary rice types shown to customers and used in admin product forms */
export const PRIMARY_RICE_CATEGORIES = [
  {
    slug: "basmati",
    name: "Basmati",
    description:
      "Long-grain basmati — aged, premium, and export varieties from all brands.",
    sort_order: 1,
  },
  {
    slug: "hmt-sona-masoori",
    name: "HMT Sona Masoori",
    description:
      "HMT and HMT-style sona masoori — the daily rice staple for Telangana wholesale.",
    sort_order: 2,
  },
  {
    slug: "sona-masoori",
    name: "Sona Masoori",
    description:
      "Sona masoori and steam rice varieties — hotel, daily use, and regional brands.",
    sort_order: 3,
  },
] as const;

export type PrimaryRiceCategorySlug =
  (typeof PRIMARY_RICE_CATEGORIES)[number]["slug"];

export const PRIMARY_RICE_SLUGS: PrimaryRiceCategorySlug[] =
  PRIMARY_RICE_CATEGORIES.map((c) => c.slug);

/** Legacy category slugs from early seed — map to a primary type */
export const LEGACY_CATEGORY_SLUG_MAP: Record<string, PrimaryRiceCategorySlug> =
  {
    premium: "basmati",
    "hotel-special": "basmati",
    "daily-use": "sona-masoori",
  };

export function isPrimaryRiceSlug(slug: string): slug is PrimaryRiceCategorySlug {
  return (PRIMARY_RICE_SLUGS as string[]).includes(slug);
}

export function normalizeCategorySlug(slug: string | undefined | null): string {
  if (!slug) return "";
  if (isPrimaryRiceSlug(slug)) return slug;
  return LEGACY_CATEGORY_SLUG_MAP[slug] ?? slug;
}
