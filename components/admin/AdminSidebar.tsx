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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="admin-sidebar w-64 min-h-screen flex flex-col shrink-0"
      style={{ backgroundColor: "#1a1a1a", color: "#f5f0e8" }}
    >
      <div
        className="p-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(201,162,39,0.2)" }}
        >
          <Wheat className="h-5 w-5" style={{ color: "#c9a227" }} />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#f5f0e8" }}>
            Rice Platform
          </p>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.5)" }}>
            Admin Console
          </p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "admin-nav-active flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                  : "admin-nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
              }
              style={
                active
                  ? {
                      backgroundColor: "rgba(201,162,39,0.2)",
                      color: "#c9a227",
                    }
                  : { color: "rgba(245,240,232,0.75)" }
              }
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAdmin} className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          type="submit"
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm"
          style={{ color: "rgba(245,240,232,0.7)" }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </form>
    </aside>
  );
}
