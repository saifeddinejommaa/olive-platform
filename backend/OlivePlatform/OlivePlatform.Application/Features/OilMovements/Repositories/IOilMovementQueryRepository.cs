using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilMovements.Requests;
using OlivePlatform.Application.Features.OilMovements.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IOilMovementQueryRepository
{
    Task<PagedResult<OilMovementForListResponse>> GetOilMovements(
        OilMovementsRequestFilter filter);

    Task<OilMovement?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OilMovement>> GetByTankIdAsync(
        int tankId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OilMovement>> GetByOilBatchIdAsync(
        int oilBatchId,
        CancellationToken cancellationToken = default);
}