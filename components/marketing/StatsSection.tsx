"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

type Stats = {
  years?: string;
  clients?: string;
  districts?: string;
  tonnes?: string;
};

export function StatsSection({ stats }: { stats: Stats | null }) {
  const items = [
    { value: stats?.years || "25+", label: "Years of Trust" },
    { value: stats?.clients || "500+", label: "B2B Clients" },
    { value: stats?.districts || "33", label: "Districts Served" },
    { value: stats?.tonnes || "10,000+", label: "Tonnes Supplied" },
  ];

  return (
    <section className="section-padding bg-rice text-cream content-visibility-auto">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Impact"
          title="Supplying Telangana with Excellence"
          light
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl glass"
            >
              <p className="font-display text-4xl md:text-5xl text-gold">
                {item.value}
              </p>
              <p className="text-cream/70 mt-2 text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
