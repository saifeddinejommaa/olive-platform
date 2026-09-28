import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import type { PressingOperationInputDetailsResponse } from "../responses/PressingOperationInputDetailsResponse";

// L'API renvoie la source sous forme (type numérique, id) : on la convertit
// en récolte / achat, et la quantité de l'entrée est la quantité pressée.
export function PressingOperationInputDetailsMapper(
  response: PressingOperationInputDetailsResponse,
): PressingOperationInputDetails {
  const isHarvest = response.sourceType === 1;

  return {
    id: response.id,
    lotId: response.lotId,
    lotReference: response.lotReference,
    sourceType: isHarvest ? "harvest" : "purchase",
    sourceReference: response.sourceReference,
    quantityKg: response.pressedQuantityKg,
    lotQuantityKg: response.quantityKg,
    lotRemainingKg: response.remainingKg,
    harvestId: isHarvest ? response.sourceId : null,
    purchaseId: isHarvest ? null : response.sourceId,
    oliveVarietyId: response.oliveVarietyId ?? null,
    analysis: response.analysis,
  };
}
