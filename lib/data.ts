import { filterProducts, type CatalogFilters } from "@/lib/catalog-filters";
import {
  PRODUCT_ADMIN_SELECT,
  PRODUCT_PUBLIC_SELECT,
} from "@/lib/product-select";
import {
  MOCK_ANALYTICS,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_COVERAGE,
  MOCK_DISTRICTS,
  MOCK_ENQUIRIES,
  MOCK_GALLERY,
  MOCK_PRODUCTS,
  MOCK_SITE_CONTENT,
  MOCK_TESTIMONIALS,
} from "@/lib/mock-data";
import {
  isPrimaryRiceSlug,
  PRIMARY_RICE_CATEGORIES,
} from "@/lib/rice-categories";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import type {
  Brand,
  Category,
  District,
  DistrictCoverage,
  Enquiry,
  GalleryItem,
  Json,
  Product,
  SiteContent,
  Testimonial,
} from "@/types/database";

/** Strip admin-only fields before sending products to the public site */
export function toPublicProduct(product: Product): Product {
  const { stock_quintals: _s, ...rest } = product;
  return rest;
}

function pickPrimaryCategories(categories: Category[]): Category[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const picked = PRIMARY_RICE_CATEGORIES.map((def) => {
    const existing = bySlug.get(def.slug);
    if (existing) return existing;
    return {
      id: def.slug,
      name: def.name,
      slug: def.slug,
      description: def.description,
      sort_order: def.sort_order,
    } satisfies Category;
  });
  return picked;
}

/** Three rice types: Basmati, HMT Sona Masoori, Sona Masoori */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return pickPrimaryCategories(MOCK_CATEGORIES);
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  const all = data ?? MOCK_CATEGORIES;
  const primary = all.filter((c) => isPrimaryRiceSlug(c.slug));
  return pickPrimaryCategories(primary.length ? primary : all);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return MOCK_CATEGORIES;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? MOCK_CATEGORIES;
}

export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) return MOCK_BRANDS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("priority");
  return data ?? MOCK_BRANDS;
}

export async function getProducts(
  filters?: CatalogFilters & { publishedOnly?: boolean }
): Promise<Product[]> {
  const publishedOnly = filters?.publishedOnly !== false;

  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    let products = publishedOnly
      ? adminStore.products.filter((p) => p.published)
      : [...adminStore.products];
    return filterProducts(products.map(toPublicProduct), filters);
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_PUBLIC_SELECT)
    .order("sort_order");

  if (publishedOnly) query = query.eq("published", true);
  if (filters?.featured) query = query.eq("featured", true);

  const { data } = await query;
  const rows = (data ?? []) as unknown as Product[];
  return filterProducts(rows.map(toPublicProduct), filters);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    const p = adminStore.products.find((x) => x.slug === slug && x.published);
    return p ? toPublicProduct(p) : null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const row = data as unknown as Product | null;
  return row ? toPublicProduct(row) : null;
}

export async function getDistricts(): Promise<District[]> {
  if (!isSupabaseConfigured()) return MOCK_DISTRICTS;
  const supabase = await createClient();
  const { data } = await supabase.from("districts").select("*").order("display_name");
  return data ?? MOCK_DISTRICTS;
}

export async function getDistrictCoverage(): Promise<DistrictCoverage[]> {
  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    return adminStore.coverage;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("district_coverage")
    .select("*, district:districts(*)");
  return (data as DistrictCoverage[]) ?? MOCK_COVERAGE;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return MOCK_TESTIMONIALS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");
  return data ?? MOCK_TESTIMONIALS;
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return MOCK_GALLERY;
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order");
  return data ?? MOCK_GALLERY;
}

export async function getSiteContent(key: string): Promise<Json | null> {
  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    const item = adminStore.siteContent.find((s) => s.key === key);
    return (item?.value as Json) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .single();
  return (data?.value as Json) ?? null;
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    return adminStore.siteContent;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("*");
  return data ?? MOCK_SITE_CONTENT;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  if (!isSupabaseConfigured()) {
    const { adminStore } = await import("@/lib/admin-store");
    return adminStore.enquiries;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*, product:products(name), district:districts(display_name)")
    .order("created_at", { ascending: false });
  return (data as Enquiry[]) ?? [];
}

export async function getAnalyticsSummary() {
  if (!isSupabaseConfigured()) return MOCK_ANALYTICS;

  const supabase = await createClient();
  const { count: visitCount } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  const { count: enquiryCount } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true });

  const { count: waCount } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "whatsapp_click");

  const { data: productViews } = await supabase
    .from("analytics_events")
    .select("product_id, products(name)")
    .eq("event_type", "product_view")
    .not("product_id", "is", null);

  const viewCounts = new Map<string, { name: string; views: number }>();
  productViews?.forEach((row) => {
    const name =
      (row.products as { name?: string } | null)?.name ?? "Unknown";
    const key = row.product_id ?? name;
    const existing = viewCounts.get(key);
    if (existing) existing.views += 1;
    else viewCounts.set(key, { name, views: 1 });
  });

  const topProducts = Array.from(viewCounts.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    visits: visitCount ?? 0,
    enquiries: enquiryCount ?? 0,
    whatsappClicks: waCount ?? 0,
    topProducts:
      topProducts.length > 0 ? topProducts : MOCK_ANALYTICS.topProducts,
  };
}

export async function addMockEnquiry(enquiry: Enquiry) {
  const { adminStore } = await import("@/lib/admin-store");
  adminStore.enquiries.unshift(enquiry);
}
