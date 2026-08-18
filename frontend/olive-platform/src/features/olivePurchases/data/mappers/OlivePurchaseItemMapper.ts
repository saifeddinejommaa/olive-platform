import type { OlivePurchaseItemResponse } from "../responses/OlivePurchaseItemResponse"

export function OlivePurchaseItemMapper(
    response: OlivePurchaseItemResponse
) {
    return {
        id: response.id,

        purchaseId: response.purchaseId,

        varietyId: response.varietyId,

        description: response.description,

        agreedQuantityKg: response.agreedQuantityKg,

        pricePerKg: response.pricePerKg,

        totalAmount: response.totalAmount,

        notes: response.notes
    }
}