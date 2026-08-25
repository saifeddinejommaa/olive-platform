import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import type { CompleteHarvestParams } from "../../domain/params/CompleteHarvestParams";
import type { CreateHarvestParams } from "../../domain/params/CreateHarvestParams";
import type { UpdateHarvestParams } from "../../domain/params/UpdateHarvestParams";
import { HarvestMapper } from "../mappers/HarvestMapper";
import type { HarvestResponse } from "../responses/HarvestResponse";

export const HarvestRepository = {
  getAll: async (filters?: HarvestFilters) => {

    const params = buildQueryParams(filters as any);
    const httpResponse = await http<ApiResponse<PagedResult<HarvestResponse>>>(`${API_BASE_URL}harvests?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(HarvestMapper),
    };
  },

  getById: async (id: number): Promise<Harvest> => {
    const httpResponse = await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}`
    );

    return HarvestMapper(httpResponse.Response);
  },


  create: (params: CreateHarvestParams) => {
    return http<ApiResponse<number>>(
      `${API_BASE_URL}harvests`,
      {
        method: "POST",
        body: params,
      }
    );

  },

  update: async (
    id: number,
    params: UpdateHarvestParams
  ): Promise<Harvest> => {
    const httpResponse = await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}`,
      {
        method: "PUT",
        body: params,
      }
    );

    return HarvestMapper(httpResponse.Response);
  },

  start: async (id: number): Promise<void> => {
    await http<ApiResponse<null>>(
      `${API_BASE_URL}harvests/${id}/start`,
      {
        method: 'POST',
      }
    )
  },

  complete: async (
    id: number,
    params: CompleteHarvestParams
  ): Promise<Harvest> => {
    const httpResponse = await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}/complete`,
      {
        method: "POST",
        body: params,
      }
    );

    return HarvestMapper(httpResponse.Response);
  },

  cancel: async (id: number): Promise<Harvest> => {
    const httpResponse = await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}/cancel`,
      {
        method: "POST",
      }
    );

    return HarvestMapper(httpResponse.Response);
  },
};