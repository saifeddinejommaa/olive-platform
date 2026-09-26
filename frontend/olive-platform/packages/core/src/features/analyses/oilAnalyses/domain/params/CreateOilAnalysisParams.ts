import type { OilAnalysisSourceType } from "../entities/OilAnalysisSourceType";

export type CreateOilAnalysisParams = {
  sourceTypeId: OilAnalysisSourceType;
  sourceId: number;
  plannedDate?: string;
};
