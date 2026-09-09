import type { HarvestStockStatus } from "../../domain/entities/HarvestStockStatus";

export type HarvestStockDetailsResponse = {
  id: number;
  reference: string;
  quantityKg: number;
  status: HarvestStockStatus;
  createdAt: string;
  updatedAt: string;
};