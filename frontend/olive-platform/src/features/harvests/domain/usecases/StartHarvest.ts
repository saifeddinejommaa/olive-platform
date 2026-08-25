import { HarvestRepository } from "../../data/repositories/HarvestRepository";


export async function startHarvest(id: number) {
  return HarvestRepository.start(id)
}