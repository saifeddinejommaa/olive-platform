import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export async function startHarvest(id: number, weatherAcknowledged = false) {
  return HarvestRepository.start(id, weatherAcknowledged);
}
