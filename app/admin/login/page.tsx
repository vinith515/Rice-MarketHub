import Link from "next/link";
import { Home } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SiteLogo } from "@/components/marketing/SiteLogo";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5ef]">
      <header className="shrink-0 flex items-center justify-between gap-3 px-4 py-4 border-b border-[#e5dfd4] bg-white shadow-sm">
        <SiteLogo businessName={businessName} showName variant="onLight" />
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-[#2d5a3d] bg-[#2d5a3d] px-4 py-2.5 text-sm font-semibold text-[#f5f0e8] min-h-[44px]"
        >
          <Home className="h-4 w-4 shrink-0" />
          Home
        </Link>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center p-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#e5dfd4] p-6 sm:p-8">
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}
