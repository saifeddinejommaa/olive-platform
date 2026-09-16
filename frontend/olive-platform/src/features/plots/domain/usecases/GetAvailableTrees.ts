import { PlotRepository } from "../../data/repositories/PlotsRepository";
import type { PlotVarietyDetail } from "../entities/PlotVarietyDetail";
import type { AvailableTreesParams } from "../params/AvailableTreesParams";

export const GetAvailableTrees = async (params: AvailableTreesParams) :Promise<PlotVarietyDetail> => {
  const number = await PlotRepository.getAvailableTrees(params);

  return number;
};
