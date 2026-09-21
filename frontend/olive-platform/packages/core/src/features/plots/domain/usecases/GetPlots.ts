import { PlotRepository } from "../../data/repositories/PlotsRepository";
import type { PlotsRequestFilter } from "../entities/PlotsRequestFilter";

export const GetPlots = async (filters?: PlotsRequestFilter) => {
  const harvests = await PlotRepository.getAll(filters);

  return harvests;
};
