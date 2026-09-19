import type { CostLineType } from "./CostLineType";


export interface PendingPaymentFilter {
  recipientName?: string;
  costType?: CostLineType;
  minAmount?: number;
  maxAmount?: number;
  pageNumber: number;
  pageSize: number;
}