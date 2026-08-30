import type { PagedResult } from "../../../../../core/PagedResult";
import { OliveAnalysesRepository } from "../../data/repositories/OliveAnalysesRepository";
import type { OliveAnalysesFilters } from "../entities/OliveAnalysesFilter";
import type { OliveAnalysis } from "../entities/OliveAnalysis";

export async function getOliveAnalyses(filter: OliveAnalysesFilters) : Promise<PagedResult<OliveAnalysis>> {
  return OliveAnalysesRepository.getAll(filter);
}