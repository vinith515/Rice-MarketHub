import Link from "next/link";
import { getAnalyticsSummary, getEnquiries } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Eye, MessageSquare, Phone, Package, Tag, ImageIcon } from "lucide-react";

export default async function AdminDashboardPage() {
  const [analytics, enquiries] = await Promise.all([
    getAnalyticsSummary(),
    getEnquiries(),
  ]);

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const stats = [
    {
      label: "Page views",
      value: analytics.visits,
      icon: Eye,
      color: "#2d5a3d",
    },
    {
      label: "Enquiries",
      value: analytics.enquiries,
      sub: `${newEnquiries} new`,
      icon: MessageSquare,
      color: "#c9a227",
    },
    {
      label: "WhatsApp clicks",
      value: analytics.whatsappClicks,
      icon: Phone,
      color: "#1a1a1a",
    },
  ];

  const quickLinks = [
    { href: "/admin/products", label: "Add brands & varieties", icon: Package },
    { href: "/admin/brands", label: "Upload brand logos", icon: Tag },
    { href: "/admin/media", label: "Gallery uploads", icon: ImageIcon },
    { href: "/admin/enquiries", label: "View enquiries", icon: MessageSquare },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Telangana Premium Rice · B2B platform overview"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-6">
            <div className="flex items-center justify-between">
              <stat.icon className="h-8 w-8" style={{ color: stat.color }} />
              <span
                className="text-3xl font-bold"
                style={{ color: "#1a1a1a" }}
              >
                {stat.value}
              </span>
            </div>
            <p className="mt-2 font-medium" style={{ color: "#1a1a1a" }}>
              {stat.label}
            </p>
            {stat.sub && (
              <p className="text-xs mt-1" style={{ color: "#2d5a3d" }}>
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="font-semibold mb-4" style={{ color: "#2d5a3d" }}>
            Quick actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: "#f0ebe3",
                  color: "#1a1a1a",
                }}
              >
                <link.icon className="h-5 w-5" style={{ color: "#2d5a3d" }} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="font-semibold mb-4" style={{ color: "#2d5a3d" }}>
            Recent enquiries
          </h2>
          {enquiries.length === 0 ? (
            <p className="text-sm" style={{ color: "#888" }}>
              No enquiries yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {enquiries.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between items-center py-2"
                  style={{ borderBottom: "1px solid #ebe6dc" }}
                >
                  <div>
                    <p className="font-medium text-sm">{e.contact_name}</p>
                    <p className="text-xs" style={{ color: "#888" }}>
                      {e.business_type} · {e.phone}
                    </p>
                  </div>
                  <span className="admin-badge-green capitalize text-xs">
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/enquiries"
            className="inline-block mt-4 text-sm font-medium"
            style={{ color: "#2d5a3d" }}
          >
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
}
