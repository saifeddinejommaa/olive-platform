import { http, type ApiResponse } from "../../../../core/HttpClient";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { OliveLot, OliveLotsFilter } from "../../domain/entities/OliveLot";

export const OliveLotRepository = {
  // Lots de la campagne sélectionnée (injectée par le client HTTP).
  getLots: async (filter?: OliveLotsFilter): Promise<OliveLot[]> => {
    const params = buildQueryParams((filter ?? {}) as any);
    const response = await http<ApiResponse<OliveLot[]>>(
      `olive-lots?${params.toString()}`,
    );

    return response.Response;
  },

  // « Passer sans analyse » : le lot devient pressable sans analyse terminée.
  skipAnalysis: async (lotId: number) => {
    await http<ApiResponse<null>>(`olive-lots/${lotId}/skip-analysis`, {
      method: "POST",
    });
  },
};
