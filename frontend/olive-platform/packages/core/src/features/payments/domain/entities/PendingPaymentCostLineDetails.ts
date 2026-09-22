import type { CostLineType } from "./CostLineType";

export interface PendingPaymentCostLineDetails { 
    sourceReference: number; 
    sourceId : number;
    amountDue: number;
    totalAmount:number;
    sourceName:string;
    notes: string;
    costLineType:CostLineType;
    operationDate: string
}