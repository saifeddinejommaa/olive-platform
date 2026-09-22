import { PaymentRespository } from "../../data/repositories/PaymentRepository";
import type { PayPaymentsParams } from "../params/PayPaymentsParams";

export const PayPayments = (params: PayPaymentsParams) =>  
    PaymentRespository.payPayments(params)