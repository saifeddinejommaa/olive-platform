import { PlotRepository } from "../../data/repositories/PlotsRepository";
import type { AvailableTreesParams } from "../params/AvailableTreesParams";

export const GetAvailableTrees = async (params: AvailableTreesParams) => {
  const number = await PlotRepository.getAvailableTrees(params);

  return number;
};
