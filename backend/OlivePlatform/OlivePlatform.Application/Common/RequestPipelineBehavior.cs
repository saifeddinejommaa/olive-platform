using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace OlivePlatform.Application.Common
{
    public class RequestPipelineBehavior<TRequest, TResponse>
   : IPipelineBehavior<TRequest, TResponse>
       where TRequest : notnull
    {
        private readonly ILogger<RequestPipelineBehavior<TRequest, TResponse>> _logger;

        public RequestPipelineBehavior(ILogger<RequestPipelineBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            var stopwatch = Stopwatch.StartNew();

            _logger.LogInformation("➡️ Start request: {RequestName}", requestName);

            try
            {
                var response = await next(); // call handler

                stopwatch.Stop();

                _logger.LogInformation(
                    "✅ Finished request: {RequestName} in {ElapsedMs} ms",
                    requestName,
                    stopwatch.ElapsedMilliseconds);

                return response;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();

                _logger.LogError(ex,
                    "❌ Error in request: {RequestName} after {ElapsedMs} ms",
                    requestName,
                    stopwatch.ElapsedMilliseconds);

                throw;
            }
        }
    }
}
