"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

async function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  return createClient();
}

export async function saveProductImageAction(
  productId: string,
  url: string,
  alt?: string
) {
  try {
    const supabase = await getSupabase();
    const { data: latest } = await supabase
      .from("product_images")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sort_order = (latest?.sort_order ?? -1) + 1;

    const { error } = await supabase.from("product_images").insert({
      product_id: productId,
      url,
      alt: alt ?? null,
      sort_order,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/products");
    return { success: true, url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function saveProduct3DAssetAction(
  productId: string,
  assets: { glb_url?: string; poster_url?: string; video_url?: string }
) {
  try {
    const supabase = await getSupabase();
    const { data: existing } = await supabase
      .from("product_3d_assets")
      .select("id")
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("product_3d_assets")
        .update(assets)
        .eq("product_id", productId);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("product_3d_assets").insert({
        product_id: productId,
        ...assets,
      });
      if (error) return { error: error.message };
    }

    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/products");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function saveBrandLogoAction(brandId: string, logoUrl: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("brands")
      .update({ logo_url: logoUrl })
      .eq("id", brandId);
    if (error) return { error: error.message };
    revalidatePath("/admin/brands");
    revalidatePath("/", "layout");
    revalidatePath("/products");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function saveGalleryItemAction(
  imageUrl: string,
  caption?: string,
  category = "warehouse"
) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.from("gallery_items").insert({
      image_url: imageUrl,
      caption: caption ?? null,
      category,
      sort_order: 0,
    });
    if (error) return { error: error.message };
    revalidatePath("/admin/media");
    revalidatePath("/gallery");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function deleteProductImageAction(imageId: string, productId: string) {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);
    if (error) return { error: error.message };
    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete" };
  }
}
