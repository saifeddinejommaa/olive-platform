import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { OliveAnalysisDetails } from "../entities/OliveAnalysisDetails";

export async function startOliveAnalysis(id: number) : Promise<OliveAnalysisDetails>  {
  return OliveAnalysesRepository.start(id);
}