using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPlotRepository : IRepository<Plot>
{
    Task<Plot?> GetByReferenceAsync(
        string code,
        CancellationToken cancellationToken = default);

    Task<int> GetAvailableTreesAsync(
        int plotId,
        int varietyId,
        DateOnly harvestDate,
        CancellationToken cancellationToken = default);

}