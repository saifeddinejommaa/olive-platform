import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { CompleteOliveAnalysisParams } from "../params/CompleteOliveAnalysisParams";

export async function completeOliveAnalysis(
  id: number,
  params: CompleteOliveAnalysisParams,
): Promise<void> {
  await OliveAnalysesRepository.complete(id, params);
}
