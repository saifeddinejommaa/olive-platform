import type { AppConstants } from "../../domain/models/AppConstants";
import type { AppConstantItemResponse } from "../responses/AppConstantItemResponse";
import type { AppConstantsResponse } from "../responses/AppConstantsResponse";


export function mapConstantsResponseToModel(response: AppConstantsResponse) : AppConstants {
    return  {
        OliveVarieties: mapConstantItemResponseToModel(response.OliveVarieties),
        PurchaseStatuses: mapConstantItemResponseToModel(response.PurchaseStatuses),
        SampleStatuses: mapConstantItemResponseToModel(response.SampleStatuses),
        ProductionStatuses: mapConstantItemResponseToModel(response.ProductionStatuses),
        OilMovementTypes: mapConstantItemResponseToModel(response.OilMovementTypes),
        InvoiceTypes: mapConstantItemResponseToModel(response.InvoiceTypes),
        InvoiceStatuses: mapConstantItemResponseToModel(response.InvoiceStatuses),
        PaymentMethods: mapConstantItemResponseToModel(response.PaymentMethods),
    }
}

export function mapConstantItemResponseToModel(items?: AppConstantItemResponse[]) {
  return (items ?? []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
};