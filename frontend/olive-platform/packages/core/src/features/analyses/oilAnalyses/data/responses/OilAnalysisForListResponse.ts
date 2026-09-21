import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OilAnalysisForListResponse = {
  id: number;
  reference: string;
  sourceReference: string | null;
  analysisDate: string | null;
  createdAt: string;
  status: ProductionStatus;
};
