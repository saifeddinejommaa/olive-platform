import { OilAnalysesRepository } from "../../data/repositories/OilAnalysesRepository";
import type { CreateOilAnalysisParams } from "../params/CreateOilAnalysisParams";
import type { UpdateOilAnalysisParams } from "../params/UpdateOilAnalysisParams";

export const GetOilAnalysisDetails = (id: number) =>
  OilAnalysesRepository.getById(id);

export const CreateOilAnalysis = (params: CreateOilAnalysisParams) =>
  OilAnalysesRepository.create(params);

export const UpdateOilAnalysis = (
  id: number,
  params: UpdateOilAnalysisParams,
) => OilAnalysesRepository.update(id, params);

export const StartOilAnalysis = (id: number) => OilAnalysesRepository.start(id);

export const CompleteOilAnalysis = (
  id: number,
  params: UpdateOilAnalysisParams,
) => OilAnalysesRepository.complete(id, params);
