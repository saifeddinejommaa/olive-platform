import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { OliveAnalysisDetails } from "../entities/OliveAnalysisDetails";

export async function cancelOliveAnalysis(id: number) : Promise<OliveAnalysisDetails> {
  return OliveAnalysesRepository.cancel(id);
}