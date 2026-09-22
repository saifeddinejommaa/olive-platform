import type { CostLineType } from "./CostLineType";

export interface PendingPayment { 
  recipientName: string | null; 
  sourceType: CostLineType; 
  paymentSources: number[]; 
  amountDue: number; 
}