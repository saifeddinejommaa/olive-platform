import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type {
  OilMovement,
  OilMovementsFilter,
  TransferOilBetweenTanksParams,
  TransferOilToStorageParams,
} from "../../domain/entities/OilMovement";

export const OilMovementRepository = {
  getMovements: async (
    filter?: OilMovementsFilter,
  ): Promise<PagedResult<OilMovement>> => {
    const params = buildQueryParams((filter ?? {}) as any);
    const response = await http<ApiResponse<PagedResult<OilMovement>>>(
      `oilmovements?${params.toString()}`,
    );

    return response.Response;
  },

  // Retourne le nombre de mouvements créés (un par lot transféré).
  transferBetweenTanks: async (params: TransferOilBetweenTanksParams): Promise<number> => {
    const response = await http<ApiResponse<number>>(`oilmovements/transfer`, {
      method: "POST",
      body: params,
    });

    return response.Response;
  },

  // Retourne le nombre de mouvements créés (un par lot transféré).
  transferToStorage: async (params: TransferOilToStorageParams): Promise<number> => {
    const response = await http<ApiResponse<number>>(
      `oilmovements/transfer-to-storage`,
      {
        method: "POST",
        body: params,
      },
    );

    return response.Response;
  },
};
