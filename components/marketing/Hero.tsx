"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppEnquiryOptions } from "./WhatsAppEnquiryOptions";
import { RiceHeroSlideshow } from "./RiceHeroSlideshow";
import { useVisitorWhatsAppMessage } from "@/hooks/useVisitorWhatsAppMessage";
import type { WhatsAppSettings } from "@/lib/whatsapp";
import { HERO_RICE_IMAGE } from "@/lib/rice-gallery-images";
import { cn } from "@/lib/utils";

type HeroContent = {
  headline?: string;
  subheadline?: string;
  tagline?: string;
};

export function Hero({
  content,
  whatsappSettings,
}: {
  content: HeroContent | null;
  whatsappSettings: WhatsAppSettings;
}) {
  const darkText = HERO_RICE_IMAGE.heroTextTheme === "dark";
  const enquiryMessage = useVisitorWhatsAppMessage();

  const headline =
    content?.headline || "Best Quality Rice at Wholesale Prices";
  const subheadline =
    content?.subheadline || "Premium Basmati & HMT, Sona Masoori";
  const tagline =
    content?.tagline || "Bulk Supply for Retailers & Hotels";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal rice-hero">
      <RiceHeroSlideshow />

      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/30" />

      <div className="relative z-10 section-padding w-full max-w-7xl mx-auto pt-28 sm:pt-32 pb-28 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            "max-w-3xl rounded-2xl p-5 sm:p-6 md:p-8",
            darkText
              ? "bg-cream/96 shadow-xl border border-rice/15"
              : "bg-charcoal/75 backdrop-blur-md border border-white/10"
          )}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-gold/40 bg-gold/15"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Telangana Wholesale Rice
          </motion.span>

          <h1
            className={cn(
              "font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4",
              darkText ? "text-charcoal" : "text-cream drop-shadow-lg"
            )}
          >
            {headline}
          </h1>

          <p className="text-xl md:text-2xl text-gradient-gold font-display mb-2">
            {subheadline}
          </p>
          <p
            className={cn(
              "text-lg mb-8 max-w-xl",
              darkText ? "text-charcoal/80" : "text-cream/90"
            )}
          >
            {tagline}
          </p>

          <div className="flex flex-col gap-4">
            <Button asChild variant="gold" size="lg" className="shadow-lg w-full sm:w-auto">
              <Link href="/products">
                Explore varieties & prices
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="hidden sm:block sm:max-w-md">
              <WhatsAppEnquiryOptions
                message={enquiryMessage}
                settings={whatsappSettings}
                layout="stack"
                showHint
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl"
        >
          {["25+ Years", "500+ Clients", "33 Districts", "10K+ Tonnes"].map(
            (stat) => (
              <div
                key={stat}
                className={cn(
                  "rice-stat-pill text-center",
                  darkText
                    ? "border-rice/25 !bg-white/95 shadow-md"
                    : "!bg-charcoal/80 border-gold/30 shadow-md"
                )}
              >
                <p className="text-gold font-display text-lg md:text-xl font-semibold">
                  {stat.split(" ")[0]}
                </p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    darkText ? "text-charcoal/75" : "text-cream/85"
                  )}
                >
                  {stat.split(" ").slice(1).join(" ")}
                </p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
