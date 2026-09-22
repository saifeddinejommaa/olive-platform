import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { DashboardSummary } from "../../domain/dashboard.types";

export const DashboardRepository = {
  getSuammary: async () => {
    const httpResponse = await http<
      ApiResponse<DashboardSummary>
    >(`dashboard/summary`);
    return httpResponse.Response;
  }
}