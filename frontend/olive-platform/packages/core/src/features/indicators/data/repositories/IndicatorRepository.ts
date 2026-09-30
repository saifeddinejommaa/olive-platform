import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { YieldIndicators } from "../../domain/entities/YieldIndicators";

export const IndicatorRepository = {
  // Campagne sélectionnée (injectée par le client HTTP).
  getYields: async (): Promise<YieldIndicators> => {
    const response = await http<ApiResponse<YieldIndicators>>(`indicators/yields`);

    return response.Response;
  },
};
