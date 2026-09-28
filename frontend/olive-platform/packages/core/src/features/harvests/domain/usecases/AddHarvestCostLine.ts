import { HarvestRepository } from "../../data/repositories/HarvestRepository";
import type { AddHarvestCostLineParams } from "../params/AddHarvestCostLineParams";

export async function addHarvestCostLine(
  harvestId: number,
  params: AddHarvestCostLineParams,
) {
  return HarvestRepository.addCostLine(harvestId, params);
}
