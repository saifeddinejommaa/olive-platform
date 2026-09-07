using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPressiongOperationQueryRepository
{
    Task<PagedResult<PressingOperationForListResponse>> GetPressingOperations(
        PressingOperationsRequestFilter filter);

    Task<PressingOperationDetailsResponse> GetPressingOperationDetails(
        int id,
        CancellationToken cancellationToken = default);

    Task<List<PressingOperationInputDetailsResponse>> GetPressingOperationInputs(int operationId, CancellationToken cancellationToken = default);
}