"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Brand, Category, Product } from "@/types/database";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import {
  filterProducts,
  groupProductsByCategory,
} from "@/lib/catalog-filters";
import { ProductCard } from "@/components/marketing/ProductCard";
import { cn } from "@/lib/utils";

export function ProductCatalog({
  products,
  categories,
  brands,
  whatsappSettings,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  whatsappSettings: WhatsAppSettings;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [brandId, setBrandId] = useState("");

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        q: query || undefined,
        category: category || undefined,
        brand: brandId || undefined,
      }),
    [products, query, category, brandId]
  );

  const brandSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 6);
  }, [brands, query]);

  const grouped = useMemo(
    () =>
      category
        ? null
        : groupProductsByCategory(
            filtered,
            categories.map((c) => ({ slug: c.slug, name: c.name }))
          ),
    [filtered, categories, category]
  );

  const showGrouped = !category && !brandId && !query && grouped && grouped.length > 0;

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <label htmlFor="catalog-search" className="sr-only">
          Search by brand or variety
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or rice variety (e.g. India Gate, HMT, basmati)…"
            className="w-full pl-12 pr-12 py-3.5 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rice/40"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {brandSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            <span className="text-xs text-muted-foreground self-center">
              Brands:
            </span>
            {brandSuggestions.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBrandId(b.id);
                  setQuery(b.name);
                }}
                className="text-xs px-3 py-1 rounded-full bg-secondary hover:bg-rice/20 transition-colors"
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={() => {
            setCategory("");
            setBrandId("");
          }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            !category && !brandId
              ? "bg-rice text-cream"
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          All types
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setCategory(cat.slug);
              setBrandId("");
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              category === cat.slug
                ? "bg-rice text-cream"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          {categories.find((c) => c.slug === category)?.description ??
            "Browse by rice type or search any brand you stock. Each variety is listed under Basmati, HMT Sona Masoori, or Sona Masoori."}
        </p>
      )}

      {brandId && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setBrandId("");
              setQuery("");
            }}
            className="text-sm text-rice underline-offset-2 hover:underline"
          >
            Clear brand filter
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No varieties match your search. Try another brand name or rice type.
        </p>
      ) : showGrouped ? (
        <div className="space-y-14">
          {grouped!.map((group) => (
            <section key={group.slug}>
              <div className="flex items-end justify-between gap-4 mb-6">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  {group.name}
                </h2>
                <Link
                  href={`/products?category=${group.slug}`}
                  className="text-sm text-rice hover:underline shrink-0"
                >
                  View all {group.name}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.products.slice(0, 6).map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    whatsappSettings={whatsappSettings}
                  />
                ))}
              </div>
              {group.products.length > 6 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  +{group.products.length - 6} more under {group.name} — use
                  filters or search to see all
                </p>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              whatsappSettings={whatsappSettings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
