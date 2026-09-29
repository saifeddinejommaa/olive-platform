import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { Tank, TanksFilter } from "../../domain/entities/Tank";
import type { TankDetails } from "../../domain/entities/TankDetails";

export const TankRepository = {
  getTanks: async (filter?: TanksFilter): Promise<PagedResult<Tank>> => {
    const params = buildQueryParams((filter ?? {}) as any);
    const response = await http<ApiResponse<PagedResult<Tank>>>(
      `tanks?${params.toString()}`,
    );

    return response.Response;
  },

  // Citerne avec son contenu (lots d'huile) et ses derniers mouvements.
  getById: async (id: number): Promise<TankDetails> => {
    const response = await http<ApiResponse<TankDetails>>(`tanks/${id}`);

    return response.Response;
  },
};
