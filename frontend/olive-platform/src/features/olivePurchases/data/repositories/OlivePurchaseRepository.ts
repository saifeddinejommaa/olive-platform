import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { OlivePurchasesFilter } from "../../domain/entities/OlivePurchaseFilter";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";
import type { CreateOlivePurchaseParams } from "../../domain/params/CreateOlivePurchaseParams";
import { OlivePurchaseDetailsMapper } from "../mappers/OlivePurchaseDetailsMapper";
import { OlivePurchaseItemDetailsMapper } from "../mappers/OlivePurchaseItemDetailsMapper";
import { OlivePurchaseMapper } from "../mappers/OlivePurchaseMapper";
import type { OlivePurchaseDetailsResponse } from "../responses/OlivePurchaseDetailsResponse";
import type { OlivePurchaseItemDetailsResponse } from "../responses/OLivePurchaseItemDetailsResponse";
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

  getPurchaseDetails: async (
    id: number,
  ) => {

    const httpResponse = await http<
      ApiResponse<OlivePurchaseDetailsResponse>
    >(`${API_BASE_URL}olivepurchases/${id}`);

    return OlivePurchaseDetailsMapper(httpResponse.Response);
  },


  getPurchaseItemsDetailsById: async (id: number) => { 
    const httpResponse = await http<ApiResponse<OlivePurchaseItemDetailsResponse[]>>
      ( `${API_BASE_URL}olivepurchases/items/${id}` ); 
      
    return httpResponse.Response.map(OlivePurchaseItemDetailsMapper); 
},

  create: (params: CreateOlivePurchaseParams) => {
    return http<ApiResponse<number>>(`${API_BASE_URL}olivepurchases`, {
      method: "POST",
      body: params,
    });
  },
};
