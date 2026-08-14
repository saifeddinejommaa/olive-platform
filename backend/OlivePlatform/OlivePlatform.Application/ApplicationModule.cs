using Autofac;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging.Abstractions;
using OlivePlatform.Application.Common;
using System.Reflection;

namespace OlivePlatform.Application
{
    public class ApplicationModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            var assembly = Assembly.GetExecutingAssembly();

            // Services
            builder.RegisterAssemblyTypes(assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            // MediatR Handlers
            builder.RegisterAssemblyTypes(assembly)
                .AsClosedTypesOf(typeof(IRequestHandler<,>))
                .AsImplementedInterfaces();

            // Validators
            builder.RegisterAssemblyTypes(assembly)
                .AsClosedTypesOf(typeof(IValidator<>))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            builder.RegisterGeneric(typeof(ValidationBehavior<,>))
                .As(typeof(IPipelineBehavior<,>))
                .InstancePerLifetimeScope();

            //AutoMapper
            builder.Register(ctx =>
            {
                var assembly = Assembly.GetExecutingAssembly();

                var config = new MapperConfiguration(cfg =>
                {
                    cfg.AddMaps(assembly);
                }, loggerFactory: new NullLoggerFactory());

                config.AssertConfigurationIsValid();

                return config.CreateMapper();
            })
            .As<IMapper>()
            .InstancePerLifetimeScope();
        }
    }
}
