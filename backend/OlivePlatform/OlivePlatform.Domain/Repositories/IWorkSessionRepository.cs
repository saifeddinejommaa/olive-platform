using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IWorkSessionRepository
    : IRepository<WorkSession>
{
    Task<IReadOnlyList<WorkSession>> GetByWorkerIdAsync(
        int workerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkSession>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}