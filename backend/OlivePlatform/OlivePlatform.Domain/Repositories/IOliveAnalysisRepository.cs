using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOliveAnalysisRepository : IRepository<OliveAnalysis>
{
    Task<OliveAnalysis?> GetBySourceAsync(
         int sourceTypeId,
         int sourceId,
         CancellationToken cancellationToken = default);

}