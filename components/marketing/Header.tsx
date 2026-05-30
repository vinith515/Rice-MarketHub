"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { SiteLogo } from "./SiteLogo";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { Button } from "@/components/ui/button";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { useVisitorWhatsAppMessage } from "@/hooks/useVisitorWhatsAppMessage";
import { siteNav, isNavActive } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function Header({
  whatsappSettings,
}: {
  whatsappSettings: WhatsAppSettings;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";
  const enquiryMessage = useVisitorWhatsAppMessage();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mt-3 sm:mt-4 flex items-center justify-between rounded-2xl border border-gold/25 bg-charcoal shadow-lg px-3 py-2.5 sm:px-6 sm:py-3">
            <Link href="/" className="group min-w-0 flex-1 lg:flex-none lg:max-w-none pr-2">
              <SiteLogo businessName={businessName} showName variant="dark" />
            </Link>

            <div className="hidden lg:flex items-center gap-5">
              {siteNav.map((item) => {
                const active = isNavActive(pathname, item.href);
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

            <div className="hidden lg:flex items-center gap-3 max-w-md shrink-0">
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
              className="lg:hidden text-cream p-2.5 rounded-lg hover:bg-white/10 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>

      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        businessName={businessName}
        enquiryMessage={enquiryMessage}
        whatsappSettings={whatsappSettings}
      />
    </>
  );
}
