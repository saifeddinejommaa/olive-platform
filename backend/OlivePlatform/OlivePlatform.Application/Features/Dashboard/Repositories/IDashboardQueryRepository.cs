using OlivePlatform.Application.Features.Dashboard.Responses;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IDashboardQueryRepository
{
    // seasonId absent : toutes campagnes confondues.
    Task<DashboardSummaryResponse> GetDashboardSummary(
        int? seasonId,
        int pressingComparisonLimit,
        CancellationToken cancellationToken = default);
}
