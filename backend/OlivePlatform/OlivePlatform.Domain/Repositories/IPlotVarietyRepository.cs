using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPlotVarietyRepository
    : IRepository<PlotVariety>
{
    Task<IReadOnlyList<PlotVariety>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);

    Task DeleteByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}