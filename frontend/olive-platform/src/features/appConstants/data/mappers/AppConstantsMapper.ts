import type { AppConstants } from "../../domain/models/AppConstants";
import type { AppConstantItemResponse } from "../responses/AppConstantItemResponse";
import type { AppConstantsResponse } from "../responses/AppConstantsResponse";

export function mapConstantsResponseToModel(
  response: AppConstantsResponse,
): AppConstants {
  return {
    oliveVarieties: mapConstantItemResponseToModel(response.oliveVarieties),
    productionStatus: mapConstantItemResponseToModel(
      response.productionStatus,
    ),
    oilMovementTypes: mapConstantItemResponseToModel(response.oilMovementTypes),
    invoiceTypes: mapConstantItemResponseToModel(response.invoiceTypes),
    invoiceStatuses: mapConstantItemResponseToModel(response.invoiceStatuses),
    paymentMethods: mapConstantItemResponseToModel(response.paymentMethods),
    purchaseStatus: mapConstantItemResponseToModel(response.purchaseStatus),
  };
}

export function mapConstantItemResponseToModel(
  items?: AppConstantItemResponse[],
) {
  return (items ?? []).map((item) => ({
    id: item.id,
    label: item.name,
  }));
}
