import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { InputSourceType } from "./InputSourceType";

export type PressingOperationInputDetails = {
  id: number;
  // Lot d'olives pressé.
  lotId: number;
  lotReference: string;
  sourceType: InputSourceType;
  // Récolte ou achat d'origine du lot.
  sourceReference: string;
  // Quantité de cette entrée (olives pressées).
  quantityKg: number;
  // Quantité totale et restant du lot.
  lotQuantityKg: number;
  lotRemainingKg: number;
  harvestId: number | null;
  purchaseId: number | null;
  oliveVarietyId: number | null;
  analysis: OliveAnalysisDetails | null;
  // Analyse obligatoire : tant qu'elle n'est pas terminée, la pression ne se lance ni ne se clôture.
  needAnalysis: boolean;
};
