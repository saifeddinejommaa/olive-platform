import { PlotRepository } from "../../data/repositories/PlotsRepository";

export const GetPlotDetails = async (plotId:number) => {
  const harvests = await PlotRepository.getPlotDetails(plotId);

  return harvests;
};