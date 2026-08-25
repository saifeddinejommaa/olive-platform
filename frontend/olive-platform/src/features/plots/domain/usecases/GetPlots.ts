import { PlotRepository } from "../../data/repositories/PlotsRepository";
import type { PlotsFilter } from "../entities/PlotsFilter";

export const GetPlots = async (filters?: PlotsFilter) => {
  const harvests = await PlotRepository.getAll(filters);

  return harvests;
};