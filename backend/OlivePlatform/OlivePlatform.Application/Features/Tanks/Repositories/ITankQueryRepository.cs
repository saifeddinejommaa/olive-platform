using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Tanks.Requests;
using OlivePlatform.Application.Features.Tanks.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface ITankQueryRepository
{
    Task<PagedResult<TankForListResponse>> GetTanks(
        TanksRequestFilter filter);

    Task<Tank?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Tank>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Tank?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default);
}