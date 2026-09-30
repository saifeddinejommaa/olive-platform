using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Weather
{
    public interface IWeatherClient
    {
        // Météo journalière d'un point GPS, du jour « from » au jour « to » inclus.
        Task<IReadOnlyList<WeatherDay>> GetDailyAsync(
            decimal latitude,
            decimal longitude,
            DateOnly from,
            DateOnly to,
            CancellationToken cancellationToken = default);
    }
}
