import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export async function cancelHarvest(id: number) {
  return HarvestRepository.cancel(id)
}