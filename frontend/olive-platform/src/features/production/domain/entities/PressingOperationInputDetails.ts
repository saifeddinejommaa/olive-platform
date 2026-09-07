import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { InputSourceType } from "../../ui/widgets/InputTypes";

export type PressingOperationInputDetails = {
  id: number;
  sourceType: InputSourceType;
  sourceReference: string;
  quantityKg: number;
  harvestId: number | null;
  purchaseItemId: number | null;
  analysis: OliveAnalysisDetails | null;
};
