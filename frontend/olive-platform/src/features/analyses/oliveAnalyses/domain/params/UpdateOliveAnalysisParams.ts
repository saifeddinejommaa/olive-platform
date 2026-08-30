export type UpdateOliveAnalysisParams = {
  id: number

  sourceTypeId: number
  sourceReference: string

  humidityPercentage?: number
  waterPercentage?: number
  oilPercentage?: number
  acidityPercentage?: number
  analysisDate?: string
}