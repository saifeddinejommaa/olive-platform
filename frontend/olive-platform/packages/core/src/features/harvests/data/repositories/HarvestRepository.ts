import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import { mapOliveAnalysisDetails } from "../../../analyses/oliveAnalyses/data/mappers/OliveAnalysisDetailsMapper";
import type { OliveAnalysisDetailsResponse } from "../../../analyses/oliveAnalyses/data/responses/OliveAnalysesDetailsResponse";
import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { HarvestDetails } from "../../domain/entities/HarvestDetails";
import type { HarvestFilters } from "../../domain/entities/HarvestsFilters";
import type { CompleteHarvestParams } from "../../domain/params/CompleteHarvestParams";
import type { CreateHarvestParams } from "../../domain/params/CreateHarvestParams";
import type { UpdateHarvestParams } from "../../domain/params/UpdateHarvestParams";
import { HarvestDetailsMapper } from "../mappers/HarvestDetailsMapper";
import { HarvestForListMapper } from "../mappers/HarvestForListMapper";
import { HarvestStockDetailsMapper } from "../mappers/HarvestStockDetailsMapper";
import type { HarvestDetailsResponse } from "../responses/HarvestDetailsResponse";
import type { HarvestForListResponse } from "../responses/HarvestForListResponse";
import type { HarvestResponse } from "../responses/HarvestResponse";
import type { HarvestStockDetailsResponse } from "../responses/HarvestStockDetailResponse";

export const HarvestRepository = {
  getAll: async (filters?: HarvestFilters) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<ApiResponse<PagedResult<HarvestForListResponse>>>(
      `harvests?${params.toString()}`,
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
      `harvests/${id}/stocks`,
    );

    return (response.Response.map(HarvestStockDetailsMapper));
  },

  getOliveAnalysis: async (id: number): Promise<OliveAnalysisDetails | null> => {
    const response = await http<ApiResponse<OliveAnalysisDetailsResponse>>(
      `harvests/${id}/olive-analysis`,
    );
    if (!response.Response) {
      return null;
    }
    return (mapOliveAnalysisDetails(response.Response));
  },

  getHarvestDetails: async (id: number): Promise<HarvestDetails> => {
    const httpResponse = await http<ApiResponse<HarvestDetailsResponse>>(
      `harvests/${id}`,
    );

    return HarvestDetailsMapper(httpResponse.Response);
  },

  create: (params: CreateHarvestParams) => {
    return http<ApiResponse<number>>(`harvests`, {
      method: "POST",
      body: params,
    });
  },

  update: async (id: number, params: UpdateHarvestParams): Promise<void> => {
     await http<ApiResponse<HarvestResponse>>(
      `harvests/${id}`,
      {
        method: "PUT",
        body: params,
      },
    );
  },

  start: async (id: number): Promise<void> => {
    await http<ApiResponse<null>>(`harvests/${id}/start`, {
      method: "POST",
    });
  },

  complete: async (
    id: number,
    params: CompleteHarvestParams,
  ): Promise<void> => {
    await http<ApiResponse<HarvestResponse>>(
      `harvests/${id}/close`,
      {
        method: "POST",
        body: params,
      },
    );
  },

  cancel: async (id: number): Promise<void> => {
    await http<ApiResponse<HarvestResponse>>(
      `harvests/${id}/cancel`,
      {
        method: "POST",
      },
    );
  },
};
