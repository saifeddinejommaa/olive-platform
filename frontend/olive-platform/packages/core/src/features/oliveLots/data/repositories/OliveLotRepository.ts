import { http, type ApiResponse } from "../../../../core/HttpClient";

export const OliveLotRepository = {
  // « Passer sans analyse » : le lot devient pressable sans analyse terminée.
  skipAnalysis: async (lotId: number) => {
    await http<ApiResponse<null>>(`olive-lots/${lotId}/skip-analysis`, {
      method: "POST",
    });
  },
};
