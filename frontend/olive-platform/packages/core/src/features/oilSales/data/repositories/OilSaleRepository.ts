import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type {
  CreateOilSaleParams,
  DeliveryPaymentParams,
  OilSaleDetails,
  OilSaleForList,
  OilSalesFilter,
} from "../../domain/entities/OilSale";

export const OilSaleRepository = {
  getSales: async (filter?: OilSalesFilter): Promise<PagedResult<OilSaleForList>> => {
    const params = buildQueryParams((filter ?? {}) as any);
    const response = await http<ApiResponse<PagedResult<OilSaleForList>>>(
      `oil-sales?${params.toString()}`,
    );

    return response.Response;
  },

  getById: async (id: number): Promise<OilSaleDetails> => {
    const response = await http<ApiResponse<OilSaleDetails>>(`oil-sales/${id}`);

    return response.Response;
  },

  // Création en brouillon ; retourne l'identifiant de la vente.
  create: async (params: CreateOilSaleParams): Promise<number> => {
    const response = await http<ApiResponse<number>>(`oil-sales`, {
      method: "POST",
      body: params,
    });

    return response.Response;
  },

  // Modification d'une vente en brouillon (les lignes sont remplacées).
  update: async (id: number, params: CreateOilSaleParams): Promise<void> => {
    await http<ApiResponse<number>>(`oil-sales/${id}`, {
      method: "PUT",
      body: params,
    });
  },

  // Livraison (sortie des citernes), avec le paiement reçu à l'enlèvement s'il y en a un.
  deliver: async (id: number, payment?: DeliveryPaymentParams): Promise<void> => {
    await http<ApiResponse<null>>(`oil-sales/${id}/deliver`, {
      method: "POST",
      body: { payment: payment ?? null },
    });
  },

  cancel: async (id: number): Promise<void> => {
    await http<ApiResponse<null>>(`oil-sales/${id}/cancel`, { method: "POST" });
  },
};
