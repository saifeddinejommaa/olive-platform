import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export async function searchWorkers(search: string, limit = 8) {
  return HarvestRepository.searchWorkers(search, limit);
}
