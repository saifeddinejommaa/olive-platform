import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { OlivePurchasesFilter } from "../../domain/entities/OlivePurchaseFilter";
import type { OlivePurchaseItemsFilter } from "../../domain/entities/OlivePurchaseItemsFilter";
import { OlivePurchaseItemMapper } from "../mappers/OlivePurchaseItemMapper";
import { OlivePurchaseMapper } from "../mappers/OlivePurchaseMapper";
import type { OlivePurchaseItemResponse } from "../responses/OlivePurchaseItemResponse";
import type { OlivePurchaseResponse } from "../responses/OlivePurchaseResponse";

export const OlivePurchaseRepository = {
  getAll: async (filters?: OlivePurchasesFilter) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<OlivePurchaseResponse>>
    >(`${API_BASE_URL}olivepurchases?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(OlivePurchaseMapper),
    };
  },

  getPurchaseItemsById: async (
    id: number,
    filters?: OlivePurchaseItemsFilter,
  ) => {
    const params = buildQueryParams(filters as any);

    const httpResponse = await http<
      ApiResponse<PagedResult<OlivePurchaseItemResponse>>
    >(`${API_BASE_URL}olivepurchases/items/${id}?${params.toString()}`);

    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(OlivePurchaseItemMapper),
    };
  },
};
