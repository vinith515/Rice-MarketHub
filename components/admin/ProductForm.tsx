"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createProductAction,
  updateProductDetailsAction,
  deleteProductAction,
} from "@/app/admin/catalog-actions";
import { PACKAGE_SIZES } from "@/lib/constants";
import { PRIMARY_RICE_CATEGORIES } from "@/lib/rice-categories";
import type { Brand, Category, Product } from "@/types/database";

export function ProductForm({
  product,
  brands,
  categories,
}: {
  product?: Product;
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const defaultCategory =
    product?.category?.slug &&
    PRIMARY_RICE_CATEGORIES.some((c) => c.slug === product.category?.slug)
      ? product.category.slug
      : "basmati";

  const selectedSizes = new Set(
    product?.package_sizes?.filter((p) => p.available).map((p) => p.size_kg) ?? [
      10, 25, 50,
    ]
  );

  return (
    <form
      className="admin-card p-5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = product
            ? await updateProductDetailsAction(product.id, fd)
            : await createProductAction(fd);
          if (result?.error) {
            setError(result.error);
            return;
          }
          if (result && "id" in result && result.id) {
            router.push(`/admin/products/${result.id}`);
          } else {
            router.refresh();
          }
        });
      }}
    >
      <h3 className="font-semibold" style={{ color: "#1a1a1a" }}>
        {product ? "Edit variety" : "Add rice variety"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Variety name</label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className="admin-input w-full mt-1"
            placeholder="e.g. India Gate Basmati Classic 1kg"
          />
        </div>
        <div>
          <label className="admin-label">URL slug (optional)</label>
          <input
            name="slug"
            defaultValue={product?.slug}
            className="admin-input w-full mt-1"
            placeholder="auto-generated from name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Rice type (category)</label>
          <select
            name="category_slug"
            defaultValue={defaultCategory}
            className="admin-input w-full mt-1"
            required
          >
            {(categories.length
              ? categories
              : PRIMARY_RICE_CATEGORIES.map((c) => ({
                  slug: c.slug,
                  name: c.name,
                }))
            ).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Brand</label>
          <select
            name="brand_id"
            defaultValue={product?.brand_id ?? ""}
            className="admin-input w-full mt-1"
            required
          >
            <option value="">Select brand…</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="admin-label">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          className="admin-input w-full mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border border-dashed border-[#c9a227]/40 bg-[#faf8f4]">
        <div>
          <label className="admin-label">Price per kg (₹) — shown to customers</label>
          <input
            name="price_per_kg"
            type="number"
            min={0}
            step={0.5}
            defaultValue={product?.price_per_kg ?? ""}
            className="admin-input w-full mt-1"
            placeholder="e.g. 85"
          />
        </div>
        <div>
          <label className="admin-label">Stock remaining (quintals) — admin only</label>
          <input
            name="stock_quintals"
            type="number"
            min={0}
            step={0.5}
            defaultValue={product?.stock_quintals ?? 0}
            className="admin-input w-full mt-1"
            placeholder="e.g. 50"
          />
          <p className="text-xs mt-1" style={{ color: "#888" }}>
            Not visible on the public website
          </p>
        </div>
      </div>

      <div>
        <label className="admin-label">Pack sizes available</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {PACKAGE_SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={`size_${size}`}
                defaultChecked={selectedSizes.has(size)}
              />
              {size} kg
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="admin-label">Availability</label>
          <select
            name="availability_status"
            defaultValue={product?.availability_status ?? "in_stock"}
            className="admin-input w-full mt-1"
          >
            <option value="in_stock">In stock</option>
            <option value="limited">Limited</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>
        <div>
          <label className="admin-label">Sort order</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className="admin-input w-full mt-1"
          />
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured}
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product?.published ?? true}
            />
            Published (visible to customers)
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className="admin-btn-gold">
          {pending ? "Saving…" : product ? "Save variety" : "Add variety"}
        </button>
        {product && (
          <button
            type="button"
            disabled={pending}
            className="text-sm px-4 py-2 rounded-lg"
            style={{ color: "#b91c1c", border: "1px solid #fecaca" }}
            onClick={() => {
              if (!confirm(`Delete "${product.name}"? This cannot be undone.`))
                return;
              startTransition(async () => {
                const result = await deleteProductAction(product.id);
                if (result?.error) setError(result.error);
                else router.push("/admin/products");
              });
            }}
          >
            Delete variety
          </button>
        )}
      </div>
    </form>
  );
}
