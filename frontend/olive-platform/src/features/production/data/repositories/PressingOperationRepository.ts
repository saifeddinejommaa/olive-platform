import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { PressingOperation } from "../../domain/entities/PressingOperation";
import type { PressingOperationFilters } from "../../domain/entities/PressingOperationFilters";
import { PressingOperationMapper } from "../mappers/PressingOperationMapper";
import type { PressingOperationResponse } from "../responses/PressingOperationResponse";
import { API_BASE_URL } from "../../../../constants";

export const PressingOperationRepository = {
  getAll: async (filters?: PressingOperationFilters) => {
    
      const params = buildQueryParams(filters as any);
       const httpResponse = await  http<ApiResponse<PagedResult<PressingOperationResponse>>>(`${API_BASE_URL}pressingoperations?${params.toString()}`);
          return {
               pageNumber: httpResponse.Response.pageNumber,
               pageSize: httpResponse.Response.pageSize,
               totalCount: httpResponse.Response.totalCount,
               items: httpResponse.Response.items.map(PressingOperationMapper),
             };
    },
  
    getAssetId: (id: number) => {
      return http<ApiResponse<PressingOperation>>(`${API_BASE_URL}pressingoperations`);
    },
};