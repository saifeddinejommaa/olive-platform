export type OliveAnalysisForListResponse = {
  id: number;

  total: number;

  reference: string;

  sourceReference: number;

  plotReference: number;

  plannedDate?: string;

  startTime?: string;

  endTime?: string;

  status: number;
};
