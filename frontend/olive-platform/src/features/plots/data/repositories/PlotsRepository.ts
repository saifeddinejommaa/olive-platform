import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { PlotDetails } from "../../domain/entities/PlotDetails";
import type { PlotForList } from "../../domain/entities/PlotForList";
import type { PlotsRequestFilter } from "../../domain/entities/PlotsRequestFilter";
import type { PlotVarietyDetail } from "../../domain/entities/PlotVarietyDetail";
import type { AvailableTreesParams } from "../../domain/params/AvailableTreesParams";
import { PlotDetailsMapper } from "../mappers/PlotDetailsMapper";
import type { PlotDetailsResponse } from "../responses/PlotDetailsResponse";
export const PlotRepository = {
  getAll: async (filters?: PlotsRequestFilter) => {
    const params = buildQueryParams(filters as any);

    const httpResponse = await http<ApiResponse<PagedResult<PlotForList>>>(
      `${API_BASE_URL}plots?${params.toString()}`,
    );

    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items,
    };
  },

  getAvailableTrees: async (params: AvailableTreesParams): Promise<PlotVarietyDetail> => {
    const httpResponse = await http<ApiResponse<PlotVarietyDetail>>(
      `${API_BASE_URL}plots/${params.plotId}/available-trees?varietyId=${params.varietyId}`,
    );

    return httpResponse.Response;
  },

  async getPlotDetails(id: number): Promise<PlotDetails> {
    const response = await http<ApiResponse<PlotDetailsResponse>>(`${API_BASE_URL}plots/${id}`);
    return PlotDetailsMapper(response.Response);
  }
};
