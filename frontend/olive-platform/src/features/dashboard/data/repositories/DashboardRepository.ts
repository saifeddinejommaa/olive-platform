import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { DashboardSummary } from "../../domain/dashboard.types";

export const DashboardRepository = {
  getSuammary: async () => {
    const httpResponse = await http<
      ApiResponse<DashboardSummary>
    >(`${API_BASE_URL}dashboard/summary`);
    return httpResponse.Response;
  }
}