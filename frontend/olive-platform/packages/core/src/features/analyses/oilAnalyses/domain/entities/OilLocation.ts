import type { TankType } from "../../../../tanks/domain/entities/Tank";

// Citerne contenant une partie de l'huile analysée.
export type OilLocation = {
  tankId: number;
  tankCode: string;
  tankName: string | null;
  tankType: TankType;
  tankTypeLabel: string;
  oilCategoryLabel: string;
  quantityLiters: number;
  capacityLiters: number;
  batchNumbers: string | null;
};
