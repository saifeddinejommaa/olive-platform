using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Application.Features.OlivePurchases.Responses;
using OlivePlatform.Application.Features.Plots.Responses;
using OlivePlatform.Application.Features.Production.Responses;
using OlivePlatform.Application.Features.Weather;
using OlivePlatform.Infrastructure.Weather;

namespace OlivePlatform.Infrastructure
{
    public static class InfrastructureServicesConfiguration
    {
        public static IServiceCollection ConfigureInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            AddDapperCustomTypeHandlers();

            // Météo : options (clé en user secrets), cache et client HTTP typé.
            // Le nom « ...Client » n'est pas enregistré automatiquement par Autofac.
            services.Configure<WeatherOptions>(configuration.GetSection("Weather"));
            services.AddMemoryCache();
            services.AddHttpClient<IWeatherClient, VisualCrossingWeatherClient>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            return services;
        }

        private static void AddDapperCustomTypeHandlers()
        {

            SqlMapper.AddTypeHandler(
                new JsonObjectTypeHandler<OliveAnalysisInfoResponse>());
            SqlMapper.AddTypeHandler(
               new JsonObjectTypeHandler<List<PlotVarietyDetail>>());
            SqlMapper.AddTypeHandler(
                new JsonObjectTypeHandler<PressingParametersResponse>());
            SqlMapper.AddTypeHandler(
               new JsonObjectTypeHandler<List<HarvestCostSummaryResponse>>());
            SqlMapper.AddTypeHandler(
               new JsonObjectTypeHandler<HarvestStartWeatherResponse>());
            SqlMapper.AddTypeHandler(
               new JsonObjectTypeHandler<SupplierDetailsResponse>());
        }
    }
}
