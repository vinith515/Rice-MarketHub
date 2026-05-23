import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_ENQUIRIES,
  MOCK_GALLERY,
  MOCK_PRODUCTS,
  MOCK_SITE_CONTENT,
  MOCK_TESTIMONIALS,
  MOCK_COVERAGE,
} from "@/lib/mock-data";
import type {
  Brand,
  Category,
  Enquiry,
  GalleryItem,
  Product,
  SiteContent,
  Testimonial,
  DistrictCoverage,
  Json,
} from "@/types/database";

/** In-memory store for demo admin when Supabase is not configured */
export const adminStore = {
  products: [...MOCK_PRODUCTS],
  brands: [...MOCK_BRANDS],
  categories: [...MOCK_CATEGORIES],
  enquiries: MOCK_ENQUIRIES,
  gallery: [...MOCK_GALLERY],
  testimonials: [...MOCK_TESTIMONIALS],
  siteContent: [...MOCK_SITE_CONTENT],
  coverage: [...MOCK_COVERAGE],
};

export function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
  const e = adminStore.enquiries.find((x) => x.id === id);
  if (e) e.status = status;
}

export function upsertSiteContent(key: string, value: Record<string, unknown>) {
  const jsonValue = value as Json;
  const existing = adminStore.siteContent.find((s) => s.key === key);
  if (existing) {
    existing.value = jsonValue;
    existing.updated_at = new Date().toISOString();
  } else {
    adminStore.siteContent.push({
      id: crypto.randomUUID(),
      key,
      value: jsonValue,
      updated_at: new Date().toISOString(),
    });
  }
}

export function updateCoverage(
  id: string,
  data: Partial<Pick<DistrictCoverage, "is_served" | "delivery_available" | "notes">>
) {
  const c = adminStore.coverage.find((x) => x.id === id);
  if (c) Object.assign(c, data);
}

export function deleteGalleryItem(id: string) {
  adminStore.gallery = adminStore.gallery.filter((g) => g.id !== id);
}

export function addGalleryItem(item: GalleryItem) {
  adminStore.gallery.push(item);
}

export function toggleProductFeatured(id: string) {
  const p = adminStore.products.find((x) => x.id === id);
  if (p) p.featured = !p.featured;
}

export function toggleProductPublished(id: string) {
  const p = adminStore.products.find((x) => x.id === id);
  if (p) p.published = !p.published;
}

function findCategoryBySlug(slug: string): Category | undefined {
  return adminStore.categories.find((c) => c.slug === slug);
}

export function addBrandToStore(data: {
  name: string;
  type: Brand["type"];
  priority: number;
}) {
  const brand: Brand = {
    id: crypto.randomUUID(),
    name: data.name,
    type: data.type,
    logo_url: null,
    priority: data.priority,
    created_at: new Date().toISOString(),
  };
  adminStore.brands.push(brand);
  return brand;
}

export function updateBrandInStore(
  id: string,
  data: Partial<Pick<Brand, "name" | "type" | "priority" | "logo_url">>
) {
  const b = adminStore.brands.find((x) => x.id === id);
  if (b) Object.assign(b, data);
}

export function deleteBrandFromStore(id: string) {
  adminStore.brands = adminStore.brands.filter((b) => b.id !== id);
  adminStore.products.forEach((p) => {
    if (p.brand_id === id) p.brand_id = null;
  });
}

export function addProductToStore(data: {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  brandId: string;
  featured: boolean;
  published: boolean;
  availability_status: Product["availability_status"];
  sort_order: number;
  sizes: number[];
  price_per_kg?: number | null;
  stock_quintals?: number;
}): Product {
  const category = findCategoryBySlug(data.categorySlug);
  const brand = adminStore.brands.find((b) => b.id === data.brandId);
  const id = crypto.randomUUID();
  const product: Product = {
    id,
    slug: data.slug,
    name: data.name,
    category_id: category?.id ?? data.categorySlug,
    brand_id: data.brandId,
    description: data.description,
    featured: data.featured,
    published: data.published,
    availability_status: data.availability_status,
    sort_order: data.sort_order,
    external_id: null,
    price_per_kg: data.price_per_kg ?? null,
    stock_quintals: data.stock_quintals ?? 0,
    created_at: new Date().toISOString(),
    category,
    brand,
    images: [],
    package_sizes: data.sizes.map((size_kg, i) => ({
      id: `ps-${id}-${i}`,
      product_id: id,
      size_kg,
      available: true,
    })),
    asset_3d: null,
  };
  adminStore.products.push(product);
  return product;
}

export function updateProductInStore(
  id: string,
  data: {
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    brandId: string | null;
    featured: boolean;
    published: boolean;
    availability_status: Product["availability_status"];
    sort_order: number;
    sizes: number[];
    price_per_kg?: number | null;
    stock_quintals?: number;
  }
) {
  const p = adminStore.products.find((x) => x.id === id);
  if (!p) return;
  const category = findCategoryBySlug(data.categorySlug);
  const brand = data.brandId
    ? adminStore.brands.find((b) => b.id === data.brandId)
    : undefined;
  Object.assign(p, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    category_id: category?.id ?? data.categorySlug,
    brand_id: data.brandId,
    featured: data.featured,
    published: data.published,
    availability_status: data.availability_status,
    sort_order: data.sort_order,
    price_per_kg: data.price_per_kg ?? p.price_per_kg,
    stock_quintals: data.stock_quintals ?? p.stock_quintals,
    category,
    brand,
    package_sizes: data.sizes.map((size_kg, i) => ({
      id: `ps-${id}-${i}`,
      product_id: id,
      size_kg,
      available: true,
    })),
  });
}

export function deleteProductFromStore(id: string) {
  adminStore.products = adminStore.products.filter((p) => p.id !== id);
}
