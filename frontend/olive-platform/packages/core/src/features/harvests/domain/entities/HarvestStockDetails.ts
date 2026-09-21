import type { HarvestStockStatus } from "./HarvestStockStatus";
 
export type HarvestStockDetails = {
  id: number;
  reference: string;
  quantityKg: number;
  status: HarvestStockStatus;
  createdAt: string;
  updatedAt: string;
};