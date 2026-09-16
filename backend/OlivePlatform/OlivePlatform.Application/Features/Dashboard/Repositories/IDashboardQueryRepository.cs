using OlivePlatform.Application.Features.Dashboard.Responses;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IDashboardQueryRepository
{
    Task<DashboardSummaryResponse> GetDashboardSummary(
        DateTime harvestYieldFromDate,
        int pressingComparisonLimit,
        CancellationToken cancellationToken = default);
}