"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  MessageSquare,
  MessageCircle,
  MapPin,
  FileText,
  ImageIcon,
  BarChart3,
  LogOut,
  Wheat,
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/districts", label: "Districts", icon: MapPin },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar({
  mobileOpen = false,
  onNavigate,
}: {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "admin-sidebar flex flex-col shrink-0 bg-[#1a1a1a] text-[#f5f0e8]",
        "fixed md:static inset-y-0 left-0 z-[65] w-[min(280px,88vw)] md:w-64",
        "transform transition-transform duration-200 ease-out md:transform-none",
        "md:min-h-screen shadow-xl md:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#c9a22733]">
          <Wheat className="h-5 w-5 text-[#c9a227]" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">Rice Platform</p>
          <p className="text-xs opacity-50">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px]",
                active
                  ? "bg-[#c9a22733] text-[#c9a227]"
                  : "text-[#f5f0e8bf] hover:bg-white/5"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAdmin} className="p-4 border-t border-white/10">
        <button
          type="submit"
          className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm text-[#f5f0e8b3] min-h-[44px] hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </form>
    </aside>
  );
}
