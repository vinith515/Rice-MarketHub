"use client";

import { HomePageAdminLogin } from "@/components/marketing/AdminLoginPanel";

/** Opens admin login when URL has ?admin=1 (replaces /admin/login) */
export function HomePageClient() {
  return <HomePageAdminLogin />;
}
