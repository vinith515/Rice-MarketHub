"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DistrictCoverage } from "@/types/database";
import { cn } from "@/lib/utils";

export function DistrictMap({ coverage }: { coverage: DistrictCoverage[] }) {
  const [selected, setSelected] = useState<DistrictCoverage | null>(
    coverage[0] ?? null
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="relative aspect-square max-w-lg mx-auto w-full">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D5A3D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <ellipse
            cx="200"
            cy="200"
            rx="160"
            ry="140"
            fill="url(#mapGrad)"
            stroke="#C9A227"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          {coverage.map((c, i) => {
            const angle = (i / coverage.length) * Math.PI * 2 - Math.PI / 2;
            const x = 200 + Math.cos(angle) * 100;
            const y = 200 + Math.sin(angle) * 85;
            const isSelected = selected?.id === c.id;
            return (
              <g key={c.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 14 : 10}
                  fill={c.is_served ? "#2D5A3D" : "#666"}
                  stroke={isSelected ? "#C9A227" : "#fff"}
                  strokeWidth={2}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelected(c)}
                />
                {isSelected && (
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    className="fill-gold text-[10px] font-semibold"
                    style={{ fontSize: 10 }}
                  >
                    {c.district?.display_name?.split(" ")[0]}
                  </text>
                )}
              </g>
            );
          })}
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-charcoal/60 text-sm font-display"
            style={{ fontSize: 14 }}
          >
            Telangana
          </text>
        </svg>
      </div>

      <motion.div
        key={selected?.id}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border bg-card p-8"
      >
        {selected ? (
          <>
            <h3 className="font-display text-2xl mb-2">
              {selected.district?.display_name}
            </h3>
            <div className="flex gap-2 mb-4">
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full",
                  selected.is_served
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {selected.is_served ? "Served" : "On Request"}
              </span>
              {selected.delivery_available && (
                <span className="text-xs px-3 py-1 rounded-full bg-gold/20 text-gold">
                  Delivery Available
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              {selected.notes || "Contact us for supply availability in this district."}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">
            Select a district on the map to view coverage details.
          </p>
        )}

        <ul className="mt-8 space-y-2 max-h-48 overflow-y-auto">
          {coverage.map((c) => (
            <li
              key={c.id}
              className={cn(
                "flex justify-between items-center py-2 px-3 rounded-lg cursor-pointer transition-colors",
                selected?.id === c.id ? "bg-rice/10" : "hover:bg-secondary"
              )}
              onClick={() => setSelected(c)}
            >
              <span>{c.district?.display_name}</span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  c.is_served ? "bg-rice" : "bg-gray-400"
                )}
              />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
