import type { CostLineType } from "../entities/CostLineType";

export interface GetPendingPaymentDetailsParams {
     sourceType: CostLineType; 
     sourceIds: number[]; 
}