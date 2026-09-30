import { http, type ApiResponse } from "../../../../core/HttpClient";
import type {
  HarvestWeatherAdvice,
  WeatherForecast,
} from "../../domain/entities/WeatherForecast";

export const WeatherRepository = {
  // Sans parcelle : la première parcelle géolocalisée.
  getForecast: async (plotId?: number): Promise<WeatherForecast> => {
    const query = plotId ? `?plotId=${plotId}` : "";
    const response = await http<ApiResponse<WeatherForecast>>(`weather/forecast${query}`);

    return response.Response;
  },

  // Conseil météo pour une récolte ; date au format « AAAA-MM-JJ ».
  getHarvestAdvice: async (plotId: number, date: string): Promise<HarvestWeatherAdvice> => {
    const response = await http<ApiResponse<HarvestWeatherAdvice>>(
      `weather/harvest-advice?plotId=${plotId}&date=${date}`,
    );

    return response.Response;
  },

  // Météo du jour avant de lancer une récolte (parcelle de la récolte).
  getHarvestStartCheck: async (harvestId: number): Promise<HarvestWeatherAdvice> => {
    const response = await http<ApiResponse<HarvestWeatherAdvice>>(
      `weather/harvest-start-check?harvestId=${harvestId}`,
    );

    return response.Response;
  },
};
