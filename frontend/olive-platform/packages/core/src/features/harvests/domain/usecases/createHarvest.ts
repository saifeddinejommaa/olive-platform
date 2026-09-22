import { HarvestRepository } from "../../data/repositories/HarvestRepository";
import type { CreateHarvestParams } from "../params/CreateHarvestParams";

export async function createHarvestUseCase(params: CreateHarvestParams) {
  const response = HarvestRepository.create(params);
  return response;
}
