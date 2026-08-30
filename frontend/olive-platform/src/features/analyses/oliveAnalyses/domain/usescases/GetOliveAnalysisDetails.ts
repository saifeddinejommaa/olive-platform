import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { OliveAnalysisDetails } from "../entities/OliveAnalysisDetails";

export async function getOliveAnalysisDetails(id: number) : Promise<OliveAnalysisDetails> {
  return OliveAnalysesRepository.getById(id);
}