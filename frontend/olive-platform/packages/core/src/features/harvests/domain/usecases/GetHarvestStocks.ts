import { HarvestRepository } from "../../data/repositories/HarvestRepository";
import type { HarvestStockDetails } from "../entities/HarvestStockDetails";

export async function GetHarvestStocks(
  harvestId: number,
): Promise<HarvestStockDetails[]> {
  return await HarvestRepository.getStocks(harvestId);
}