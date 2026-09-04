import type { AppConstantItemResponse } from "./AppConstantItemResponse";

export type AppConstantsResponse = {
  oliveVarieties: AppConstantItemResponse[];
  productionStatus: AppConstantItemResponse[];
  oilMovementTypes: AppConstantItemResponse[];
  invoiceTypes: AppConstantItemResponse[];
  invoiceStatuses: AppConstantItemResponse[];
  paymentMethods: AppConstantItemResponse[];
  purchaseStatus: AppConstantItemResponse[];
};
