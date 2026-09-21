import type { CostLineType } from "../entities/CostLineType";
import type { PaymentMethod } from "../entities/PaymentMethod";

export interface PayPaymentsParams {
  sourceType: CostLineType;
  sourceIds: number[];
  amountToPay: number;
  method: PaymentMethod;
}