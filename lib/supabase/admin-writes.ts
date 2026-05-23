import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

function hasServiceRoleKey(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return Boolean(key && !key.includes("your_service_role"));
}

function formatRlsHint(message: string): string {
  if (
    message.includes("row-level security") ||
    message.includes("permission denied")
  ) {
    return `${message} — Ensure your user has a row in Supabase \`profiles\` with role \`admin\`, or set SUPABASE_SERVICE_ROLE_KEY in .env.local.`;
  }
  return message;
}

/** Client for admin catalog mutations (brands, products, etc.) */
export async function getAdminWriteClient(): Promise<
  | { client: SupabaseClient; mode: "service" | "session" }
  | { error: string }
> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured" };
  }

  if (hasServiceRoleKey()) {
    const client = await createServiceClient();
    return { client, mode: "service" };
  }

  const client = await createClient();
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    return {
      error:
        "Not signed in. Open /admin/login, sign in with your Supabase admin account, then try again.",
    };
  }

  return { client, mode: "session" };
}

export function wrapDbError(error: { message: string } | null): string | null {
  if (!error) return null;
  return formatRlsHint(error.message);
}
