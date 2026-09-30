using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Weather
{
    public record WeatherDay(
    DateOnly Date,
    decimal? TempMin,          // °C
    decimal? TempMax,          // °C
    decimal? PrecipitationMm,  // mm
    decimal? PrecipitationProbability, // %
    decimal? WindSpeedKmh,     // km/h
    string? Conditions,
    // Pictogramme Visual Crossing : rain, clear-day, partly-cloudy-day…
    string? Icon);
}
