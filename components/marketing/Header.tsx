"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteLogo } from "./SiteLogo";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import { buildGeneralEnquiryMessage } from "@/lib/whatsapp";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/coverage", label: "Coverage" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  whatsappSettings,
}: {
  whatsappSettings: WhatsAppSettings;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";
  const enquiryMessage = buildGeneralEnquiryMessage();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-3 sm:mt-4 flex items-center justify-between rounded-2xl border border-gold/25 bg-charcoal shadow-lg px-3 py-2.5 sm:px-6 sm:py-3">
          <Link href="/" className="group min-w-0 max-w-[58%] sm:max-w-none">
            <SiteLogo businessName={businessName} showName variant="dark" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    active
                      ? "text-gold"
                      : "text-cream/90 hover:text-gold"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 max-w-md">
            <Button asChild variant="gold" size="sm" className="shrink-0 shadow-md">
              <Link href="/products">Products</Link>
            </Button>
            <WhatsAppEnquiryOptions
              message={enquiryMessage}
              settings={whatsappSettings}
              layout="compact"
            />
          </div>

          <button
            type="button"
            className="lg:hidden text-cream p-2.5 rounded-lg hover:bg-white/10 shrink-0"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-charcoal/60 lg:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-3 right-3 top-[4.75rem] z-[110] lg:hidden rounded-2xl border-2 border-gold/30 bg-charcoal p-4 shadow-2xl max-h-[min(70vh,32rem)] overflow-y-auto"
            >
              <nav className="flex flex-col">
                {nav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block py-3.5 text-base font-medium border-b border-white/10 last:border-0",
                        active ? "text-gold" : "text-cream hover:text-gold"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <Button asChild variant="gold" className="w-full h-11">
                  <Link href="/products" onClick={() => setOpen(false)}>
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
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
