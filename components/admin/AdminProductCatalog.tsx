"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Pencil, Package } from "lucide-react";
import type { Category, Product } from "@/types/database";
import {
  filterProducts,
  groupProductsByCategory,
} from "@/lib/catalog-filters";
import { ProductToggleButtons } from "@/components/admin/ProductToggleButtons";
import { formatPricePerKg } from "@/lib/pricing";

export function AdminProductCatalog({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        q: query || undefined,
        category: category || undefined,
      }),
    [products, query, category]
  );

  const grouped = useMemo(
    () =>
      category
        ? [{ slug: category, name: categories.find((c) => c.slug === category)?.name ?? category, products: filtered }]
        : groupProductsByCategory(
            filtered,
            categories.map((c) => ({ slug: c.slug, name: c.name }))
          ),
    [filtered, categories, category]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "#888" }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand or variety…"
            className="admin-input w-full pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="admin-input sm:w-56"
        >
          <option value="">All rice types</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <p className="text-sm" style={{ color: "#666" }}>
          No products match. Add a variety above.
        </p>
      ) : (
        grouped.map((group) => (
          <section key={group.slug}>
            <h2
              className="text-lg font-bold mb-3 pb-2"
              style={{ color: "#2d5a3d", borderBottom: "2px solid #c9a227" }}
            >
              {group.name}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "#888" }}
              >
                ({group.products.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {group.products.map((product) => {
                const thumb = product.images?.[0]?.url;
                return (
                  <div key={product.id} className="admin-card overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="relative w-full md:w-40 h-32 shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: "#ebe6dc" }}
                      >
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        ) : (
                          <Package
                            className="h-10 w-10"
                            style={{ color: "#c9a227" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-bold" style={{ color: "#1a1a1a" }}>
                          {product.name}
                        </h3>
                        <p className="text-sm" style={{ color: "#5c5c5c" }}>
                          {product.brand?.name ?? "No brand"}
                          {formatPricePerKg(product.price_per_kg)
                            ? ` · ${formatPricePerKg(product.price_per_kg)}`
                            : ""}
                        </p>
                        <p className="text-xs mt-1 admin-badge-gold inline-block">
                          Stock: {product.stock_quintals ?? 0} quintals (admin)
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="admin-btn-gold inline-flex items-center gap-2 text-sm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit & media
                          </Link>
                          <ProductToggleButtons
                            productId={product.id}
                            featured={product.featured}
                            published={product.published}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
