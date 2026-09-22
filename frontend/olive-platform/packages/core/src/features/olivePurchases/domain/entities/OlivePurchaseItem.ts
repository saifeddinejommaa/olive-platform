import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type OlivePurchaseItem = {
  id: number;

  reference: string;

  purchaseId: number;

  variety: OliveVarieties;

  description: string | null;

  agreedQuantityKg: number;

  pressedQuantityKg: number;

  remainingQuantityKg: number;

  pricePerKg: number;

  totalAmount: number | null;

  notes: string | null;
};
