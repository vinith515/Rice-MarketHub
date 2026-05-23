"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { PRODUCT_ADMIN_SELECT } from "@/lib/product-select";
import { createClient } from "@/lib/supabase/server";
import {
  adminStore,
  updateEnquiryStatus,
  upsertSiteContent,
  updateCoverage,
  toggleProductFeatured,
  toggleProductPublished,
} from "@/lib/admin-store";
import type { Enquiry, Product } from "@/types/database";

export type LoginAdminState = { error?: string };

export async function loginAdmin(
  _prev: LoginAdminState,
  formData: FormData
): Promise<LoginAdminState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!isSupabaseConfigured()) {
    if (email === "admin@example.com" && password === "admin123") {
      const cookieStore = await cookies();
      cookieStore.set("demo_admin", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      redirect("/admin");
    }
    return {
      error:
        "Invalid demo login. Use admin@example.com / admin123 when Supabase is not configured.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Invalid email or password. Use the same Supabase user you created in Authentication → Users (not the local demo login)."
          : error.message,
    };
  }
  redirect("/admin");
}

export async function logoutAdmin() {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    cookieStore.delete("demo_admin");
    redirect("/admin/login");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateEnquiryStatusAction(
  id: string,
  status: Enquiry["status"]
) {
  if (!isSupabaseConfigured()) {
    updateEnquiryStatus(id, status);
    return { success: true };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateSiteContentAction(
  key: string,
  value: Record<string, unknown>
) {
  if (!isSupabaseConfigured()) {
    upsertSiteContent(key, value);
    return { success: true };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCoverageAction(
  id: string,
  data: { is_served?: boolean; delivery_available?: boolean; notes?: string }
) {
  if (!isSupabaseConfigured()) {
    updateCoverage(id, data);
    return { success: true };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("district_coverage")
    .update(data)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleProductFeaturedAction(id: string) {
  if (!isSupabaseConfigured()) {
    toggleProductFeatured(id);
    return { success: true };
  }
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("featured")
    .eq("id", id)
    .single();
  const { error } = await supabase
    .from("products")
    .update({ featured: !product?.featured })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleProductPublishedAction(id: string) {
  if (!isSupabaseConfigured()) {
    toggleProductPublished(id);
    return { success: true };
  }
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("published")
    .eq("id", id)
    .single();
  const { error } = await supabase
    .from("products")
    .update({ published: !product?.published })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [...adminStore.products];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_ADMIN_SELECT)
    .order("sort_order");
  return (data ?? adminStore.products) as Product[];
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return adminStore.products.find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_ADMIN_SELECT)
    .eq("id", id)
    .single();
  return data as Product | null;
}

export async function getAdminBrands() {
  if (!isSupabaseConfigured()) {
    const { MOCK_BRANDS } = await import("@/lib/mock-data");
    return MOCK_BRANDS;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").order("priority");
  return data ?? [];
}

export async function getAdminEnquiries() {
  if (!isSupabaseConfigured()) return [...adminStore.enquiries];
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? adminStore.enquiries;
}
