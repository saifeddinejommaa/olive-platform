using OlivePlatform.Application.Features.Indicators.Responses;

namespace OlivePlatform.Application.Features.Indicators.Repositories;

public interface IIndicatorQueryRepository
{
    Task<YieldIndicatorsResponse> GetYieldsAsync(
        int? seasonId,
        CancellationToken cancellationToken = default);
}
