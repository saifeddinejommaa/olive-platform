import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { OliveAnalysisDetails } from "../entities/OliveAnalysisDetails";
import type { UpdateOliveAnalysisParams } from "../params/UpdateOliveAnalysisParams";

export async function updateOliveAnalysis(id: number,params: UpdateOliveAnalysisParams): Promise<void> {
  await OliveAnalysesRepository.update(id, params);
}