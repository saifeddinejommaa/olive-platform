using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPlotRepository : IRepository<Plot>
{
    // Première parcelle (par référence) qui a des coordonnées GPS.
    Task<Plot?> GetFirstGeolocatedAsync(
        CancellationToken cancellationToken = default);
}