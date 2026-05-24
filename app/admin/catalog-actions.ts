"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getAdminWriteClient, wrapDbError } from "@/lib/supabase/admin-writes";
import { slugify } from "@/lib/slug";
import { PRIMARY_RICE_SLUGS } from "@/lib/rice-categories";
import {
  addBrandToStore,
  addProductToStore,
  deleteBrandFromStore,
  deleteProductFromStore,
  updateBrandInStore,
  updateProductInStore,
} from "@/lib/admin-store";
import { PACKAGE_SIZES } from "@/lib/constants";
import type { Product } from "@/types/database";

function parsePackageSizes(formData: FormData): number[] {
  return PACKAGE_SIZES.filter((size) => formData.get(`size_${size}`) === "on");
}

function parsePricePerKg(formData: FormData): number | null {
  const raw = (formData.get("price_per_kg") as string)?.trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseStockQuintals(formData: FormData): number {
  const raw = (formData.get("stock_quintals") as string)?.trim();
  const n = Number(raw || 0);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function createBrandAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const type = (formData.get("type") as "own" | "external") || "external";
  const priority = Number(formData.get("priority") || 0);

  if (!name) return { error: "Brand name is required" };

  if (!isSupabaseConfigured()) {
    addBrandToStore({ name, type, priority });
    revalidatePath("/admin/brands");
    revalidatePath("/products");
    return { success: true };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { data, error } = await admin.client
    .from("brands")
    .insert({ name, type, priority })
    .select("id")
    .single();

  const err = wrapDbError(error);
  if (err) return { error: err };

  revalidatePath("/admin/brands");
  revalidatePath("/products");
  return { success: true, id: data?.id };
}

export async function updateBrandAction(brandId: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const type = (formData.get("type") as "own" | "external") || "external";
  const priority = Number(formData.get("priority") || 0);

  if (!name) return { error: "Brand name is required" };

  if (!isSupabaseConfigured()) {
    updateBrandInStore(brandId, { name, type, priority });
    revalidatePath("/admin/brands");
    revalidatePath("/products");
    return { success: true };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.client
    .from("brands")
    .update({ name, type, priority })
    .eq("id", brandId);
  const err = wrapDbError(error);
  if (err) return { error: err };
  revalidatePath("/admin/brands");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteBrandAction(brandId: string) {
  if (!isSupabaseConfigured()) {
    deleteBrandFromStore(brandId);
    revalidatePath("/admin/brands");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.client.from("brands").delete().eq("id", brandId);
  const err = wrapDbError(error);
  if (err) return { error: err };
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function createProductAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const categorySlug = formData.get("category_slug") as string;
  const brandId = (formData.get("brand_id") as string) || null;
  const slugInput = (formData.get("slug") as string)?.trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name || "");
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const availability_status =
    (formData.get("availability_status") as Product["availability_status"]) ||
    "in_stock";
  const sort_order = Number(formData.get("sort_order") || 0);
  const sizes = parsePackageSizes(formData);
  const price_per_kg = parsePricePerKg(formData);
  const stock_quintals = parseStockQuintals(formData);

  if (!name) return { error: "Variety name is required" };
  if (
    !categorySlug ||
    !(PRIMARY_RICE_SLUGS as readonly string[]).includes(categorySlug)
  ) {
    return { error: "Select a rice type: Basmati, HMT Sona Masoori, or Sona Masoori" };
  }
  if (!brandId) return { error: "Select a brand" };
  if (sizes.length === 0) return { error: "Select at least one pack size" };

  if (!isSupabaseConfigured()) {
    const product = addProductToStore({
      name,
      slug,
      description,
      categorySlug,
      brandId,
      featured,
      published,
      availability_status,
      sort_order,
      sizes,
      price_per_kg,
      stock_quintals,
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, id: product.id };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { data: category } = await admin.client
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();
  if (!category) return { error: "Category not found in database" };

  const { data: product, error } = await admin.client
    .from("products")
    .insert({
      name,
      slug,
      description,
      category_id: category.id,
      brand_id: brandId,
      featured,
      published,
      availability_status,
      sort_order,
      price_per_kg,
      stock_quintals,
    })
    .select("id")
    .single();

  const err = wrapDbError(error);
  if (err) return { error: err };

  const { error: sizesError } = await admin.client
    .from("product_package_sizes")
    .insert(
      sizes.map((size_kg) => ({
        product_id: product!.id,
        size_kg,
        available: true,
      }))
    );
  const sizesErr = wrapDbError(sizesError);
  if (sizesErr) return { error: sizesErr };
  if (!product?.id) return { error: "Product was created but no id was returned." };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, id: product.id };
}

export async function updateProductDetailsAction(
  productId: string,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const categorySlug = formData.get("category_slug") as string;
  const brandId = (formData.get("brand_id") as string) || null;
  const slug = slugify((formData.get("slug") as string)?.trim() || name || "");
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const availability_status =
    (formData.get("availability_status") as Product["availability_status"]) ||
    "in_stock";
  const sort_order = Number(formData.get("sort_order") || 0);
  const sizes = parsePackageSizes(formData);
  const price_per_kg = parsePricePerKg(formData);
  const stock_quintals = parseStockQuintals(formData);

  if (!name) return { error: "Variety name is required" };
  if (!(PRIMARY_RICE_SLUGS as readonly string[]).includes(categorySlug)) {
    return { error: "Select a valid rice type" };
  }

  if (!isSupabaseConfigured()) {
    updateProductInStore(productId, {
      name,
      slug,
      description,
      categorySlug,
      brandId,
      featured,
      published,
      availability_status,
      sort_order,
      sizes,
      price_per_kg,
      stock_quintals,
    });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/products");
    return { success: true };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { data: category } = await admin.client
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();
  if (!category) return { error: "Category not found" };

  const { error } = await admin.client
    .from("products")
    .update({
      name,
      slug,
      description,
      category_id: category.id,
      brand_id: brandId,
      featured,
      published,
      availability_status,
      sort_order,
      price_per_kg,
      stock_quintals,
    })
    .eq("id", productId);

  const err = wrapDbError(error);
  if (err) return { error: err };

  await admin.client
    .from("product_package_sizes")
    .delete()
    .eq("product_id", productId);
  if (sizes.length > 0) {
    const { error: sizesError } = await admin.client
      .from("product_package_sizes")
      .insert(
        sizes.map((size_kg) => ({
          product_id: productId,
          size_kg,
          available: true,
        }))
      );
    const sizesErr = wrapDbError(sizesError);
    if (sizesErr) return { error: sizesErr };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  if (!isSupabaseConfigured()) {
    deleteProductFromStore(productId);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  }

  const admin = await getAdminWriteClient();
  if ("error" in admin) return { error: admin.error };

  const { error } = await admin.client.from("products").delete().eq("id", productId);
  const err = wrapDbError(error);
  if (err) return { error: err };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
