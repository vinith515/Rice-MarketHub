/** 1 quintal = 100 kg */
export const KG_PER_QUINTAL = 100;

export function formatPricePerKg(price: number | null | undefined): string | null {
  if (price == null || Number.isNaN(price)) return null;
  return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}/kg`;
}

export function formatPricePerKgParts(
  price: number | null | undefined
): { amount: string; unit: string } | null {
  if (price == null || Number.isNaN(price)) return null;
  return {
    amount: `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
    unit: "/kg",
  };
}

export function formatQuantityLine(
  unit: "quintals" | "bags" | null | undefined,
  value: number | null | undefined,
  packageKg?: number | null
): string | null {
  if (!unit || value == null) return null;
  if (unit === "quintals") {
    return `${value} quintal${value === 1 ? "" : "s"} (${value * KG_PER_QUINTAL} kg)`;
  }
  const bagLabel = packageKg ? `${value} bag(s) of ${packageKg}kg` : `${value} bag(s)`;
  return bagLabel;
}

export function estimateLineTotal(
  pricePerKg: number | null | undefined,
  unit: "quintals" | "bags" | null | undefined,
  value: number | null | undefined,
  packageKg?: number | null
): number | null {
  if (pricePerKg == null || !unit || value == null) return null;
  let kg = 0;
  if (unit === "quintals") kg = value * KG_PER_QUINTAL;
  else if (unit === "bags" && packageKg) kg = value * packageKg;
  else return null;
  return pricePerKg * kg;
}
