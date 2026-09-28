export type OliveAnalysisForListResponse = {
  id: number;

  total: number;

  reference: string;

  sourceTypeId: number | null;

  sourceReference: string | null;

  plotReference: string | null;

  humidityPercentage: number | null;

  waterPercentage: number | null;

  oilPercentage: number | null;

  acidityPercentage: number | null;

  plannedDate?: string;

  startTime?: string;

  endTime?: string;

  status: number;
};
