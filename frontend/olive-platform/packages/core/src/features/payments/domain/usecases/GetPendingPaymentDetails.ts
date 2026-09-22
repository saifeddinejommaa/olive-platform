import { PaymentRespository } from "../../data/repositories/PaymentRepository";
import type { PendingPaymentDetails } from "../entities/PendingPaymentDetails";
import type { GetPendingPaymentDetailsParams } from "../params/GetPendingPaymentDetailsParams";

export const GetPendingPaymentDetails = async ( request: GetPendingPaymentDetailsParams): Promise<PendingPaymentDetails> => 
    { 
        return PaymentRespository.getPendingPaymentDetails(request); 
    };