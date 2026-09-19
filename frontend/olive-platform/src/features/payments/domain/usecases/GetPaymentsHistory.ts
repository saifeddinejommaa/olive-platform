import { PaymentRespository } from "../../data/repositories/PaymentRepository";
import type { PaymentHistoryFilter } from "../entities/PaymentHistoryFilter";

export const GetPaymentsHistory = (filter: PaymentHistoryFilter) =>  
    PaymentRespository.getPaymentsHistory(filter)