import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import type { CreateHarvestParams } from "../../domain/params/CreateHarvestParams";
import { HarvestMapper } from "../mappers/HarvestMapper";
import type { HarvestResponse } from "../responses/HarvestResponse";

export const HarvestRepository = {
  getAll: async (filters?: HarvestFilters) => {
    
      const params = buildQueryParams(filters as any);
       const httpResponse = await  http<ApiResponse<PagedResult<HarvestResponse>>>(`${API_BASE_URL}harvests?${params.toString()}`);
          return {
               pageNumber: httpResponse.Response.pageNumber,
               pageSize: httpResponse.Response.pageSize,
               totalCount: httpResponse.Response.totalCount,
               items: httpResponse.Response.items.map(HarvestMapper),
             };
    },
  
    getAssetId: (id: number) => {
      return http<ApiResponse<Harvest>>(`${API_BASE_URL}harvests/${id}`);
    },
    
    create: (params: CreateHarvestParams) => {
    return  http<ApiResponse<number>>(
          `${API_BASE_URL}harvests`,
          {
            method: "POST",
            body: params,
          }
        );

     }
};