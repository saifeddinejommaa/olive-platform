import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { PendingPayment } from "../../domain/entities/PandingPayment";
import type { PaymentHistoryFilter } from "../../domain/entities/PaymentHistoryFilter";
import type { PendingPaymentDetails } from "../../domain/entities/PendingPaymentDetails";
import type { PendingPaymentFilter } from "../../domain/entities/PendingPaymentFilter";
import type { ProcessedPayment } from "../../domain/entities/ProcessedPayment";
import type { GetPendingPaymentDetailsParams } from "../../domain/params/GetPendingPaymentDetailsParams";
import type { PayPaymentsParams } from "../../domain/params/PayPaymentsParams";

export const PaymentRespository = {
  getPendingPayment: async (filter: PendingPaymentFilter): Promise<PagedResult<PendingPayment>> => {
    const params = buildQueryParams(filter as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<PendingPayment>>
    >(`payments/pending?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items,
    };
  },
  getPaymentsHistory: async (filter: PaymentHistoryFilter): Promise<PagedResult<ProcessedPayment>> => {
    const params = buildQueryParams(filter as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<ProcessedPayment>>
    >(`payments/history?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items,
    };
  },
  getPendingPaymentDetails: async (params: GetPendingPaymentDetailsParams): Promise<PendingPaymentDetails> => {
    const queryParams = new URLSearchParams();

    queryParams.append("SourceType", params.sourceType.toString());

    params.sourceIds.forEach((sourceId) => {
      queryParams.append("SourceIds", sourceId.toString());
    });
    const httpResponse = await http<
      ApiResponse<PendingPaymentDetails>
    >(`payments/pending-details?${queryParams.toString()}`);

    return httpResponse.Response;
  },
  payPayments: async (params: PayPaymentsParams): Promise<void> => {
     await http<
      ApiResponse<PendingPaymentDetails>
    >(`payments/pay`, {
      method: "POST",
      body: params,
    });


  }
}