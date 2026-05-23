"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/database";
import { SectionHeading } from "./SectionHeading";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <section className="section-padding content-visibility-auto">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by Telangana Businesses"
          description="Retailers, hotels, and caterers rely on our consistent quality and service."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
            >
              <Quote className="h-8 w-8 text-gold/40 mb-4" />
              <p className="text-foreground/90 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t">
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {t.business_type}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
