using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Weather
{
    public class WeatherOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public int CacheHours { get; set; } = 3;
    }
}
