import Image from "next/image";
import { Wheat } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteLogo({
  logoUrl,
  businessName,
  showName = true,
  variant = "dark",
}: {
  logoUrl?: string | null;
  businessName: string;
  showName?: boolean;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";

  return (
    <span className="flex items-center gap-2.5 min-w-0">
      {logoUrl ? (
        <span
          className={cn(
            "relative h-10 w-10 shrink-0 rounded-xl overflow-hidden",
            isDark
              ? "bg-white ring-1 ring-gold/30"
              : "bg-white/10 ring-1 ring-white/20"
          )}
        >
          <Image
            src={logoUrl}
            alt={`${businessName} logo`}
            fill
            className="object-contain p-1"
            sizes="40px"
            priority
            unoptimized
          />
        </span>
      ) : (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isDark
              ? "bg-gold/25 text-gold ring-1 ring-gold/40"
              : "bg-gold/20 text-gold ring-1 ring-gold/30"
          )}
        >
          <Wheat className="h-5 w-5" />
        </span>
      )}
      {showName && (
        <span
          className={cn(
            "font-display text-lg font-semibold truncate",
            isDark ? "text-cream" : "text-cream"
          )}
        >
          {businessName}
        </span>
      )}
    </span>
  );
}
