import { normalizeCategorySlug } from "@/lib/rice-categories";
import type { Brand, Product } from "@/types/database";

export type CatalogFilters = {
  category?: string;
  brand?: string;
  q?: string;
  featured?: boolean;
};

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

/** Match product or brand name for customer / admin search */
export function productMatchesQuery(product: Product, q: string): boolean {
  const needle = normalizeQuery(q);
  if (!needle) return true;

  const haystacks = [
    product.name,
    product.description,
    product.slug,
    product.brand?.name,
    product.category?.name,
    product.category?.slug,
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());

  return haystacks.some((h) => h.includes(needle));
}

export function brandMatchesQuery(brand: Brand, q: string): boolean {
  const needle = normalizeQuery(q);
  if (!needle) return true;
  return brand.name.toLowerCase().includes(needle);
}

export function filterProducts(
  products: Product[],
  filters?: CatalogFilters
): Product[] {
  let result = [...products];

  if (filters?.featured) {
    result = result.filter((p) => p.featured);
  }

  if (filters?.category) {
    const want = normalizeCategorySlug(filters.category);
    result = result.filter(
      (p) => normalizeCategorySlug(p.category?.slug) === want
    );
  }

  if (filters?.brand) {
    result = result.filter((p) => p.brand_id === filters.brand);
  }

  if (filters?.q) {
    result = result.filter((p) => productMatchesQuery(p, filters.q!));
  }

  return result;
}

export function groupProductsByCategory(
  products: Product[],
  categoryOrder: { slug: string; name: string }[]
): { slug: string; name: string; products: Product[] }[] {
  const groups = categoryOrder.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    products: products.filter(
      (p) => normalizeCategorySlug(p.category?.slug) === cat.slug
    ),
  }));
  return groups.filter((g) => g.products.length > 0);
}
