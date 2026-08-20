import type { OliveVarieties } from "../../../shared/entities/OliveVarieties"
import type { OlivePurchaseItemResponse } from "../responses/OlivePurchaseItemResponse"

export function OlivePurchaseItemMapper(
    response: OlivePurchaseItemResponse
) {
    return {
        id: response.id,

        reference: response.reference,

        purchaseId: response.purchaseId,

        variety: response.varietyId as OliveVarieties,

        description: response.description,

        agreedQuantityKg: response.agreedQuantityKg,

        pressedQuantityKg: response.pressedQuantityKg,

        remainingQuantityKg: response.remainingQuantityKg,

        pricePerKg: response.pricePerKg,

        totalAmount: response.totalAmount,

        notes: response.notes
    }
}