import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export async function completeHarvest(
  id: number,
  quantityKg: number,
  harvestedTrees: number
) {
  return HarvestRepository.complete(id, {harvestedTrees:harvestedTrees,
    quantityKg:quantityKg,
  })
}