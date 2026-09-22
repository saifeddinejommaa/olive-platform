import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export const GetHarvestDetails = async (harvestId: number) => {
  const harvest = await HarvestRepository.getHarvestDetails(harvestId);

  return harvest;
};
