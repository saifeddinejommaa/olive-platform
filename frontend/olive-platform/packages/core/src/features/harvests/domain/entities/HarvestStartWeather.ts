import type {
  WeatherAdviceLevel,
  WeatherWarning,
} from "../../../weather/domain/entities/WeatherForecast";

// Météo constatée au lancement d'une récolte.
export interface HarvestStartWeather {
  checkedAt: string;
  weatherDate: string;
  tempMin: number | null;
  tempMax: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
  windSpeedKmh: number | null;
  // Pluie cumulée des 2 jours précédents.
  previousRainMm: number | null;
  conditions: string | null;
  level: WeatherAdviceLevel;
  warnings: WeatherWarning[];
  // Lancée alors que la météo était défavorable, après confirmation.
  startedDespiteWarning: boolean;
}
