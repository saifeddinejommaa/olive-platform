import { PaymentRespository } from "../../data/repositories/PaymentRepository";
import type { PendingPaymentFilter } from "../entities/PendingPaymentFilter";

export const GetPendingPayments = (filter: PendingPaymentFilter) =>  
    PaymentRespository.getPendingPayment(filter)