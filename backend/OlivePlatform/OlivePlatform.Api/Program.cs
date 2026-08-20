using Autofac;
using Autofac.Extensions.DependencyInjection;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using OlivePlatform.Api.Middleware;
using OlivePlatform.Application;
using OlivePlatform.Application.Common;
using OlivePlatform.Infrastructure;
using OlivePlatform.Infrastructure.Services;
using System.Data;
using YourProject.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// Dependency Injection - Autofac
// ============================================================

builder.Host.UseServiceProviderFactory(
    new AutofacServiceProviderFactory());

builder.Host.ConfigureContainer<ContainerBuilder>(container =>
{
    container.RegisterModule(new ApplicationModule());
    container.RegisterModule(new InfrastructureModule());
});

// ============================================================
// MVC / Controllers
// ============================================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// ============================================================
// Routes
// ============================================================

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

// ============================================================
// Entity Framework Core
// ============================================================

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found.");

builder.Services.AddDbContext<OlivePlatformAppDbContext>(
    options =>
    {
        options.UseNpgsql(connectionString);
    });

builder.Services.AddScoped<
    IDocumentNumberService,
    DocumentNumberService>();

// ============================================================
// Dapper
// ============================================================

builder.Services.AddScoped<IDbConnection>(_ =>
    new NpgsqlConnection(connectionString));

// ============================================================
// MediatR
// ============================================================

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(
        typeof(Program).Assembly);
});

builder.Services.AddTransient(
    typeof(IPipelineBehavior<,>),
    typeof(RequestPipelineBehavior<,>));

// ============================================================
// Logging
// ============================================================

builder.Logging.AddConsole();

// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// ============================================================
// Build application
// ============================================================

var app = builder.Build();

// ============================================================
// HTTP Pipeline
// ============================================================

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Exception Middleware
app.UseMiddleware<ExceptionHandlerMiddlware>();

// API Response Middleware
app.UseMiddleware<ApiResponseMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// ============================================================
// Run
// ============================================================

Console.WriteLine(
    $"Environment = {builder.Environment.EnvironmentName}");

app.Run();