import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { WhatsAppOptionsLoader } from "./WhatsAppOptionsLoader";
import { SiteLogo } from "./SiteLogo";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { isGroupConfigured } from "@/lib/whatsapp";

export async function Footer() {
  const businessName =
    process.env.NEXT_PUBLIC_BUSINESS_NAME || "Telangana Premium Rice";
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 98765 43210";
  const email =
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "enquiries@example.com";
  const settings = await getWhatsAppSettings();

  return (
    <footer className="relative z-30 isolate bg-charcoal text-cream border-t-2 border-gold/30 shadow-[0_-12px_40px_rgba(26,26,26,0.35)]">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <SiteLogo businessName={businessName} showName variant="dark" />
            </div>
            <p className="text-cream/90 max-w-md leading-relaxed">
              Premium B2B rice distribution across Telangana. Enquire via our
              business number or team WhatsApp group.
            </p>
            <div className="mt-6">
              <WhatsAppOptionsLoader layout="stack" showHint />
            </div>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-cream/90">
              <li>
                <Link href="/products" className="hover:text-gold">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/coverage" className="hover:text-gold">
                  District Coverage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-cream/90 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
              <li className="flex items-start gap-2 min-w-0">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </li>
              {isGroupConfigured(settings) && (
                <li className="text-cream/60 text-xs pt-2">
                  Team enquiries: {settings.group_label}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/75">
          <p>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
          <p>B2B Enquiry Platform · No online payments</p>
        </div>
      </div>
    </footer>
  );
}
