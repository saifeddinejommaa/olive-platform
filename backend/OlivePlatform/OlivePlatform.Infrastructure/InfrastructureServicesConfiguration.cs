using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Infrastructure
{
    public static class InfrastructureServicesConfiguration
    {
        public static IServiceCollection ConfigureInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            AddDapperCustomTypeHandlers();

            return services;
        }

        private static void AddDapperCustomTypeHandlers()
        {

            SqlMapper.AddTypeHandler(
                new JsonObjectTypeHandler<OliveAnalysisInfoResponse>());
            SqlMapper.AddTypeHandler(
               new JsonObjectTypeHandler<List<PlotVarietyDetail>>());
        }
    }
}
