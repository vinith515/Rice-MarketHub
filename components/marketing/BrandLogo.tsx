import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
} as const;

export function BrandLogo({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null;
  name: string;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const box = cn(
    "relative shrink-0 rounded-lg overflow-hidden border border-border/80 bg-white shadow-sm",
    sizeMap[size],
    className
  );

  if (src) {
    return (
      <span className={box}>
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          className="object-contain p-1"
          sizes="56px"
          unoptimized
        />
      </span>
    );
  }

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={cn(
        box,
        "flex items-center justify-center bg-rice/10 text-rice font-semibold text-[10px]"
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
