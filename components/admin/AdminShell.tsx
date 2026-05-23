"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[#1a1a1a] text-[#f5f0e8] border-b border-[#c9a22733] shadow-md">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 rounded-lg hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open admin menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="text-center flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">Rice Platform</p>
          <p className="text-[10px] opacity-60">Admin</p>
        </div>
        <div className="w-[44px]" aria-hidden />
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-[60] bg-black/60"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-[calc(100vh-57px)] md:min-h-screen">
        <AdminSidebar
          mobileOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        <main className="admin-main flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed top-3 right-3 z-[70] p-2.5 rounded-full bg-[#1a1a1a] text-[#f5f0e8] border border-[#c9a22755] shadow-lg"
          aria-label="Close admin menu"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
