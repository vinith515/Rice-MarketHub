"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLoginPanel } from "@/components/marketing/AdminLoginPanel";

/** Opens admin login when URL has ?admin=1 (replaces /admin/login) */
export function HomePageClient() {
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("admin") === "1") {
      setLoginOpen(true);
    }
  }, [searchParams]);

  return <AdminLoginPanel open={loginOpen} onClose={() => setLoginOpen(false)} />;
}
