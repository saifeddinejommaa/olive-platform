import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";

// Réponse de l'API pour une entrée d'olives d'une opération de pression.
export type PressingOperationInputDetailsResponse = {
  id: number;
  lotId: number;
  lotReference: string;
  // 1 = récolte, 2 = achat.
  sourceType: number;
  // Récolte ou achat d'origine du lot.
  sourceId: number;
  sourceReference: string;
  // Quantité totale du lot.
  quantityKg: number;
  remainingKg: number;
  // Quantité de cette entrée.
  pressedQuantityKg: number;
  oliveVarietyId: number | null;
  analysis: OliveAnalysisDetails | null;
  // Analyse obligatoire : tant qu'elle n'est pas terminée, la pression ne se lance ni ne se clôture.
  needAnalysis: boolean;
};
