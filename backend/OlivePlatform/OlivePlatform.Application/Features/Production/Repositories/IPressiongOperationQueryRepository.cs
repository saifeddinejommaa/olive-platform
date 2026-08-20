using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPressiongOperationQueryRepository
{
    Task<PagedResult<PressingOperationForListResponse>> GetPressingOperations(
        PressingOperationsRequestFilter filter);

    Task<PressingOperation?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PressingOperation>> GetAllAsync(
        CancellationToken cancellationToken = default);
}