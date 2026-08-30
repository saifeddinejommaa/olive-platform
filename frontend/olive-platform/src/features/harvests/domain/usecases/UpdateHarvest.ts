import { HarvestRepository } from "../../data/repositories/HarvestRepository";
import type { Harvest } from "../entities/Harvest";
import type { UpdateHarvestParams } from "../params/UpdateHarvestParams";

export async function updateHarvest(
  id: number,
  params: UpdateHarvestParams,
): Promise<Harvest> {
  return await HarvestRepository.update(id, params);
}
