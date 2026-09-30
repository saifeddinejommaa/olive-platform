// Météo d'une journée (unités métriques), fournie par l'API (Visual Crossing).
export type WeatherDay = {
  // « AAAA-MM-JJ ».
  date: string;
  tempMin: number | null; // °C
  tempMax: number | null; // °C
  precipitationMm: number | null;
  precipitationProbability: number | null; // %
  windSpeedKmh: number | null;
  conditions: string | null;
  // Pictogramme : rain, clear-day, partly-cloudy-day, cloudy, fog, wind, snow…
  icon: string | null;
};

// Prévisions d'une parcelle : aujourd'hui en premier, puis les jours suivants.
export type WeatherForecast = {
  plotId: number;
  plotReference: string;
  plotName: string;
  days: WeatherDay[];
};

// Niveau d'un conseil météo, du plus léger au plus grave.
export type WeatherAdviceLevel = "ok" | "info" | "warning" | "danger";

export type WeatherWarning = {
  // Code stable : rain, wet-olives, frost, wind, heat, no-gps, too-far…
  code: string;
  level: WeatherAdviceLevel;
  message: string;
};

// Conseil météo pour récolter une parcelle à une date (règles côté API).
export type HarvestWeatherAdvice = {
  plotId: number;
  plotReference: string;
  plotName: string;
  date: string;
  forecastAvailable: boolean;
  day: WeatherDay | null;
  // Pluie cumulée des 2 jours précédents.
  previousRainMm: number | null;
  level: WeatherAdviceLevel;
  warnings: WeatherWarning[];
  // Jour plus favorable proposé quand la date choisie pose problème.
  suggestedDate: string | null;
  suggestedDay: WeatherDay | null;
};
