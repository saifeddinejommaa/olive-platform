import type { HarvestStockParams } from "./HarvestStockParams";

export type CompleteHarvestParams = {
  harvestedTrees: number;
  quantityKg: number;
  completeDate: string;
  stocks : HarvestStockParams[];
  proceedAnalyse : boolean
};