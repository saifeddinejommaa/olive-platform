using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.Repositories
{
    public interface IOilAnalysisRepository : IRepository<OilAnalysis>
    {
        Task<OilAnalysis?> GetBySourceAsync(
        int sourceTypeId,
        int sourceId,
        CancellationToken cancellationToken = default);
    }
}
