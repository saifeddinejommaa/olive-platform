import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import { HarvestRepository } from "../../data/repositories/HarvestRepository";

export async function GetHarvestOliveAnalysis(
  harvestId: number,
): Promise<OliveAnalysisDetails| null> {
  return await HarvestRepository.getOliveAnalysis(harvestId);
}