import { API_BASE_URL } from "../../../../../constants";
import { http, type ApiResponse } from "../../../../../core/HttpClient";
import type { PagedResult } from "../../../../../core/PagedResult";
import { buildQueryParams } from "../../../../../core/QueryUtils";
import type { OliveAnalysesFilters } from "../../domain/entities/OliveAnalysesFilter";
import type { OliveAnalysisDetails } from "../../domain/entities/OliveAnalysisDetails";
import type { CompleteOliveAnalysisParams } from "../../domain/params/CompleteOliveAnalysisParams";
import type { CreateOliveAnalysisParams } from "../../domain/params/CreateOliveAnalysisParams";
import type { UpdateOliveAnalysisParams } from "../../domain/params/UpdateOliveAnalysisParams";
import { mapOliveAnalysisDetails } from "./mappers/OliveAnalysisDetailsMapper";
import { OliveAnalysisMapper } from "./mappers/OliveAnalysisMapper";
import type { OliveAnalysisDetailsResponse } from "./responses/OliveAnalysesDetailsResponse";
import type { OliveAnalysisForListResponse } from "./responses/OliveAnalysesResponse";


export const OliveAnalysesRepository = {
  getAll: async (filters?: OliveAnalysesFilters) => {

    const params = buildQueryParams(filters as any);
    const httpResponse = await http<ApiResponse<PagedResult<OliveAnalysisForListResponse>>>(`${API_BASE_URL}analyses/olive/all?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(OliveAnalysisMapper),
    };
  },

  getById: async (id: number): Promise<OliveAnalysisDetails> => {
    const httpResponse = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/olive/${id}`
    );

    return mapOliveAnalysisDetails(httpResponse.Response);
  },


  create: (params: CreateOliveAnalysisParams) => {
    return http<ApiResponse<number>>(
      `${API_BASE_URL}analyses/olive`,
      {
        method: "POST",
        body: params,
      }
    );

  },

  update: async (
    id: number,
    params: UpdateOliveAnalysisParams
  ): Promise<OliveAnalysisDetails> => {
    const httpResponse = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/olive/${id}/update`,
      {
        method: "PUT",
        body: params,
      }
    );

    return mapOliveAnalysisDetails(httpResponse.Response);
  },

  start: async (id: number): Promise<OliveAnalysisDetails> => {
    const httpResponse = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/olive/${id}/start`,
      {
        method: 'POST',
      }
    )

     return mapOliveAnalysisDetails(httpResponse.Response);
  },

  complete: async (
    id: number,
    params: CompleteOliveAnalysisParams
  ): Promise<OliveAnalysisDetails> => {
     const httpResponse = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/olive/${id}/close`,
      {
        method: "POST",
        body: params,
      }
    );

    return mapOliveAnalysisDetails(httpResponse.Response);
  },

  cancel: async (id: number): Promise<OliveAnalysisDetailsResponse> => {
    const httpResponse = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}analyses/olive/${id}/cancel`,
      {
        method: "POST",
      }
    );

     return mapOliveAnalysisDetails(httpResponse.Response);
  },
};