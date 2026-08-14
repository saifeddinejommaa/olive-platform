using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Workers.Requests;
using OlivePlatform.Application.Features.Workers.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IWorkSessionQueryRepository
{
    Task<PagedResult<WorkSessionForListResponse>> GetWorkSessions(
        WorkSessionsRequestFilter filter);

    Task<WorkSession?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkSession>> GetByWorkerIdAsync(
        int workerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkSession>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}