using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Workers.Requests;
using OlivePlatform.Application.Features.Workers.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IWorkerQueryRepository
{
    Task<PagedResult<WorkerForListResponse>> GetWorkers(
        WorkersRequestFilter filter);

    Task<Worker?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Worker>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Worker?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default);
}