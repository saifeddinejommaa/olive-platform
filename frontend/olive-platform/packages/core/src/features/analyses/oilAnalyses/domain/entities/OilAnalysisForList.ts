import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";

export type OilAnalysisForList = {
  id: number;
  reference: string;
  sourceReference: string | null;
  plannedDate: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  status: ProductionStatus;
};
