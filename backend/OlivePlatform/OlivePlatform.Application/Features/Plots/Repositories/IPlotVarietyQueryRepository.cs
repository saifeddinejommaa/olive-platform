using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Application.Features.Plots.Repositories;

public interface IPlotVarietyQueryRepository
{

    Task<PlotVariety?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PlotVariety>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PlotVariety>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);
}