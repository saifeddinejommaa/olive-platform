using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OlivePlatform.Application.Features.Production.Responses;
using System.Data;

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
                new JsonObjectTypeHandler<List<PressingOperationInputResponse>>());
        }
    }
}
