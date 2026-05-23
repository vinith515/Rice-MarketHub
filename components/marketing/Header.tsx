"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-gold/25 bg-charcoal/95 shadow-lg backdrop-blur-md px-4 py-3 md:px-6">
          <Link href="/" className="group min-w-0 max-w-[55%] sm:max-w-none">
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
            className="md:hidden text-cream p-2 rounded-lg hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-4 mt-2 rounded-2xl border border-gold/25 bg-charcoal/98 p-4 shadow-xl"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-cream font-medium border-b border-white/10 last:border-0 hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Button asChild variant="gold" className="w-full">
                <Link href="/products">View Products</Link>
              </Button>
              <WhatsAppEnquiryOptions
                message={enquiryMessage}
                settings={whatsappSettings}
                layout="stack"
                showHint
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
