using Autofac;
using OlivePlatform.Application.Common;
using OlivePlatform.Infrastructure;
using OlivePlatform.Infrastructure.Persistence;
using OlivePlatform.Infrastructure.Persistence.Repositories;

public class InfrastructureModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        var assembly = typeof(OlivePurchaseRepository).Assembly;

        // 🔹 Repositories
        builder.RegisterAssemblyTypes(assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces()
            .InstancePerLifetimeScope();

        // 🔹 DbContext
        builder.RegisterType<OlivePlatformAppDbContext>()
            .AsSelf()
            .InstancePerLifetimeScope();

        builder.RegisterType<UnitOfWork>()
            .As<IUnitOfWork>()
            .InstancePerLifetimeScope();
    }
}
