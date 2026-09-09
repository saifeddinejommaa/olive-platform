import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import { mapOliveAnalysisDetails } from "../../../analyses/oliveAnalyses/data/mappers/OliveAnalysisDetailsMapper";
import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { Harvest } from "../../domain/entities/Harvest";
import type { HarvestDetails } from "../../domain/entities/HarvestDetails";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import type { CompleteHarvestParams } from "../../domain/params/CompleteHarvestParams";
import type { CreateHarvestParams } from "../../domain/params/CreateHarvestParams";
import type { UpdateHarvestParams } from "../../domain/params/UpdateHarvestParams";
import { HarvestDetailsMapper } from "../mappers/HarvestDetailsMapper";
import { HarvestForListMapper } from "../mappers/HarvestForListMapper";
import { HarvestMapper } from "../mappers/HarvestMapper";
import { HarvestStockDetailsMapper } from "../mappers/HarvestStockDetailsMapper";
import type { HarvestDetailsResponse } from "../responses/HarvestDetailsResponse";
import type { HarvestForListResponse } from "../responses/HarvestForListResponse";
import type { HarvestResponse } from "../responses/HarvestResponse";
import type { HarvestStockDetailsResponse } from "../responses/HarvestStockDetailResponse";

export const HarvestRepository = {
  getAll: async (filters?: HarvestFilters) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<ApiResponse<PagedResult<HarvestForListResponse>>>(
      `${API_BASE_URL}harvests?${params.toString()}`,
    );
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(HarvestForListMapper),
    };
  },

  getStocks: async (id: number) => {
    const response = await http<ApiResponse<HarvestStockDetailsResponse[]>>(
      `${API_BASE_URL}harvests/${id}/stocks`,
    );

    return (response.Response.map(HarvestStockDetailsMapper));
  },

  getOliveAnalysis: async (id: number): Promise<OliveAnalysisDetails | null> => {
    const response = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `${API_BASE_URL}harvests/${id}/olive-analysis`,
    );
    if (!response.Response) {
      return null;
    }
    return (mapOliveAnalysisDetails(response.Response));
  },

  getHarvestDetails: async (id: number): Promise<HarvestDetails> => {
    const httpResponse = await http<ApiResponse<HarvestDetailsResponse>>(
      `${API_BASE_URL}harvests/${id}`,
    );

    return HarvestDetailsMapper(httpResponse.Response);
  },

  create: (params: CreateHarvestParams) => {
    return http<ApiResponse<number>>(`${API_BASE_URL}harvests`, {
      method: "POST",
      body: params,
    });
  },

  update: async (id: number, params: UpdateHarvestParams): Promise<void> => {
     await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}`,
      {
        method: "PUT",
        body: params,
      },
    );
  },

  start: async (id: number): Promise<void> => {
    await http<ApiResponse<null>>(`${API_BASE_URL}harvests/${id}/start`, {
      method: "POST",
    });
  },

  complete: async (
    id: number,
    params: CompleteHarvestParams,
  ): Promise<void> => {
    await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}/close`,
      {
        method: "POST",
        body: params,
      },
    );
  },

  cancel: async (id: number): Promise<void> => {
    await http<ApiResponse<HarvestResponse>>(
      `${API_BASE_URL}harvests/${id}/cancel`,
      {
        method: "POST",
      },
    );
  },
};
