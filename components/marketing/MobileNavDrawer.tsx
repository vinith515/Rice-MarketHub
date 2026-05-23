"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Home, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "./SiteLogo";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { siteNav, isNavActive } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function MobileNavDrawer({
  open,
  onClose,
  pathname,
  businessName,
  enquiryMessage,
  whatsappSettings,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  businessName: string;
  enquiryMessage: string;
  whatsappSettings: WhatsAppSettings;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] lg:hidden flex flex-col bg-charcoal"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 shrink-0 safe-area-top">
            <Link href="/" onClick={onClose} className="min-w-0">
              <SiteLogo businessName={businessName} showName variant="dark" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-lg text-cream hover:bg-white/10 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2">
            <Link
              href="/"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 py-4 text-lg font-semibold border-b border-white/10",
                pathname === "/"
                  ? "text-gold"
                  : "text-cream"
              )}
            >
              <Home className="h-5 w-5 shrink-0" />
              Home
            </Link>
            {siteNav
              .filter((item) => item.href !== "/")
              .map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "block py-4 text-lg font-medium border-b border-white/10",
                      active ? "text-gold" : "text-cream"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="shrink-0 p-4 pt-2 border-t border-white/10 space-y-3 safe-area-bottom">
            <Button asChild variant="gold" className="w-full h-12 text-base">
              <Link href="/products" onClick={onClose}>
                View Products
              </Link>
            </Button>
            <WhatsAppEnquiryOptions
              message={enquiryMessage}
              settings={whatsappSettings}
              layout="stack"
              showHint={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
