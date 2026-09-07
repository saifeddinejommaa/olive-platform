import { OilAnalysesRepository } from "../../data/repositories/OilAnalysesRepository";
import type { OilAnalysesFilter } from "../entities/OilAnalysesFilter";

export const GetOilAnalyses = async (params: OilAnalysesFilter) =>
  await OilAnalysesRepository.getAll(params);
