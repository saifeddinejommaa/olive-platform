import { API_BASE_URL } from "../../../../../constants";
import { http, type ApiResponse } from "../../../../../core/HttpClient";
import type { PagedResult } from "../../../../../core/PagedResult";
import { buildQueryParams } from "../../../../../core/QueryUtils";
import type { OilAnalysesFilter } from "../../domain/entities/OilAnalysesFilter";
import type { OilAnalysisDetails } from "../../domain/entities/OilAnalysisDetails";
import type { CreateOilAnalysisParams } from "../../domain/params/CreateOilAnalysisParams";
import type { UpdateOilAnalysisParams } from "../../domain/params/UpdateOilAnalysisParams";
import { mapOilAnalysisDetails } from "../mappers/MapOilAnalysisDetails";
import { mapOilAnalysisForList } from "../mappers/MapOilAnalysisForList";
import type { OilAnalysisDetailsResponse } from "../responses/OilAnalysisDetailsResponse";
import type { OilAnalysisForListResponse } from "../responses/OilAnalysisForListResponse";

export const OilAnalysesRepository = {
  getAll: async (filters?: OilAnalysesFilter) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<OilAnalysisForListResponse>>
    >(`${API_BASE_URL}analyses/oil/all?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(mapOilAnalysisForList),
    };
  },
  getById: async (id: number): Promise<OilAnalysisDetails> => {
    const response = await http<ApiResponse<OilAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/oil/${id}`,
    );

    return mapOilAnalysisDetails(response.Response);
  },

  create: async (params: CreateOilAnalysisParams): Promise<number> => {
    console.log("Creating olive analysis with params:", params);
    const response = await http<ApiResponse<number>>(
      `${API_BASE_URL}analyses/oil`,
      {
        method: "POST",
        body: params,
      },
    );

    return response.Response;
  },

  update: async (
    id: number,
    params: UpdateOilAnalysisParams,
  ): Promise<void> => {
    await http<ApiResponse<null>>(`${API_BASE_URL}analyses/oil/${id}`, {
      method: "PUT",
      body: params,
    });
  },

  start: async (id: number): Promise<void> => {
    await http<ApiResponse<null>>(`${API_BASE_URL}analyses/oil/${id}/start`, {
      method: "POST",
    });
  },

  complete: async (
    id: number,
    params: UpdateOilAnalysisParams,
  ): Promise<void> => {
    await http<ApiResponse<null>>(
      `${API_BASE_URL}analyses/oil/${id}/complete`,
      {
        method: "POST",
        body: params,
      },
    );
  },
};
