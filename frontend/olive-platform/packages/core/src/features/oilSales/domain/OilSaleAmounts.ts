import type { PriceUnit } from "./entities/OilSale";

// Densité de l'huile d'olive (kg / L) : poids estimé avant la pesée.
export const OLIVE_OIL_DENSITY = 0.916;

export const litersToKg = (liters: number) =>
  Math.round(liters * OLIVE_OIL_DENSITY * 1000) / 1000;

// Montant HT d'une ligne : quantité selon l'unité de prix × prix unitaire.
export function lineAmount(
  priceUnit: PriceUnit,
  quantityLiters: number,
  quantityKg: number | null | undefined,
  unitPrice: number,
) {
  const quantity = priceUnit === "kg" ? Number(quantityKg ?? 0) : quantityLiters;

  return Math.round(quantity * unitPrice * 1000) / 1000;
}

// Totaux HT, TVA et TTC d'une vente.
export function saleTotals(subtotal: number, taxRate: number) {
  const taxAmount = Math.round(((subtotal * taxRate) / 100) * 1000) / 1000;

  return { subtotal, taxAmount, total: subtotal + taxAmount };
}
