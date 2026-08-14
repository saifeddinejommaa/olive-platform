using Microsoft.AspNetCore.Diagnostics;
using OlivePlatform.Api.ApiResponse;
using OlivePlatform.Domain;
using System.ComponentModel.DataAnnotations;

namespace OlivePlatform.Api.Middleware
{
    public class ExceptionHandlerMiddlware
    {
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddlware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex) when (ex is TaskCanceledException)
            {
                _logger.LogInformation(ex, "Request cancelled by user");
                context.Response.StatusCode = StatusCodes.Status204NoContent;
                await context.Response.CompleteAsync();
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            if (context.Response.HasStarted)
            {
                return;
            }

            context.Response.Clear();
            context.Response.ContentType = "application/json";

            ApiResponse<object?> response;
            int statusCode;

            switch (ex)
            {
                case BusinessException businessException:
                    {
                        statusCode = StatusCodes.Status400BadRequest;
                        response = new ApiResponse<object?>(
                                statusCode,
                                null,
                                businessException.Message
                               );

                        break;
                    }
                case ValidationException validationException:
                    {
                        statusCode = StatusCodes.Status400BadRequest;
                        response = new ApiResponse<object?>(
                            statusCode,
                            null,
                            validationException.Message
                        );

                        break;
                    }
                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    response = new ApiResponse<object?>(
                        statusCode,
                        null,
                        "Internal server error"
                    );

                    break;
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
