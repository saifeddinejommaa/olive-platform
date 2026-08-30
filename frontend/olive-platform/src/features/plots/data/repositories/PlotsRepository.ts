import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { Plot } from "../../domain/entities/Plot";
import type { PlotsFilter } from "../../domain/entities/PlotsFilter";
import type { AvailableTreesParams } from "../../domain/params/AvailableTreesParams";

export const PlotRepository = {
  getAll: async (filters?: PlotsFilter) => {
    const params = buildQueryParams(filters as any);

    const httpResponse = await http<ApiResponse<PagedResult<Plot>>>(
      `${API_BASE_URL}plots?${params.toString()}`,
    );

    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items,
    };
  },

  getById: async (id: number) => {
    const httpResponse = await http<ApiResponse<Plot>>(
      `${API_BASE_URL}plots/${id}`,
    );

    return httpResponse.Response;
  },
  getAvailableTrees: async (params: AvailableTreesParams) => {
    const httpResponse = await http<ApiResponse<number>>(
      `${API_BASE_URL}plots/available-trees?plotId=${params.plotId}&varietyId=${params.varietyId}&harvestDate=${params.harvestDate}`,
    );

    return httpResponse.Response;
  },
};
