using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilMovements.Requests;
using OlivePlatform.Application.Features.OilMovements.Responses;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOilMovementQueryRepository
{
    Task<PagedResult<OilMovementForListResponse>> GetOilMovements(
        OilMovementsRequestFilter filter);

    Task<OilMovementForListResponse?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);
}
