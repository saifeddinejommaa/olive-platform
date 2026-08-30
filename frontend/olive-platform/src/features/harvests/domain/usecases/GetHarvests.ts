import { HarvestRepository } from "../../data/repositories/HarvestRepository";
import type { HarvestFilters } from "../entities/HarvestsFilters";

export const GetHarvests = async (filters?: HarvestFilters) => {
  const harvests = await HarvestRepository.getAll(filters);

  return harvests;
};
