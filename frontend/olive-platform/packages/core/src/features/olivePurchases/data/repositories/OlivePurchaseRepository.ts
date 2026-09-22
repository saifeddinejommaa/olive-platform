import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { OlivePurchasesFilter } from "../../domain/entities/OlivePurchaseFilter";
import type { CreateOlivePurchaseParams } from "../../domain/params/CreateOlivePurchaseParams";
import { OlivePurchaseDetailsMapper } from "../mappers/OlivePurchaseDetailsMapper";
import { OlivePurchaseForListMapper } from "../mappers/OlivePurchaseForListMapper";
import { OlivePurchaseItemDetailsMapper } from "../mappers/OlivePurchaseItemDetailsMapper";
import type { OlivePurchaseDetailsResponse } from "../responses/OlivePurchaseDetailsResponse";
import type { OlivePurchaseForListResponse } from "../responses/OlivePurchaseForListResponse";
import type { OlivePurchaseItemDetailsResponse } from "../responses/OlivePurchaseItemDetailsResponse";

export const OlivePurchaseRepository = {
  getAll: async (filters?: OlivePurchasesFilter) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<OlivePurchaseForListResponse>>
    >(`olivepurchases?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(OlivePurchaseForListMapper),
    };
  },

  getPurchaseDetails: async (id: number) => {
    const httpResponse = await http<ApiResponse<OlivePurchaseDetailsResponse>>(
      `olivepurchases/${id}`,
    );

    return OlivePurchaseDetailsMapper(httpResponse.Response);
  },

  getPurchaseItemsDetailsById: async (id: number) => {
    const httpResponse = await http<
      ApiResponse<OlivePurchaseItemDetailsResponse[]>
    >(`olivepurchases/items/${id}`);
    return httpResponse.Response.map(OlivePurchaseItemDetailsMapper);
  },

  create: (params: CreateOlivePurchaseParams) => {
    return http<ApiResponse<number>>(`olivepurchases`, {
      method: "POST",
      body: params,
    });
  },

  validate: (id: number) => {
    return http<ApiResponse<void>>(`olivepurchases/${id}/validate`, {
      method: "POST",
    });
  }
};
