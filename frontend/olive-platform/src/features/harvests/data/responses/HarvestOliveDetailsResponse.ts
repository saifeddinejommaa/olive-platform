import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { HarvestStockDetailsResponse } from "./HarvestStockDetailResponse";

export interface HarvestOliveDetailsResponse {
    stocksList : HarvestStockDetailsResponse [],
    oliveAnalysis? : OliveAnalysisDetailsResponse
}