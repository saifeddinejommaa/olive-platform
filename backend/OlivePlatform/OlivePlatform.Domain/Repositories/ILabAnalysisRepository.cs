using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface ILabAnalysisRepository
    : IRepository<LabAnalysis>
{
    Task<LabAnalysis?> GetByNumberAsync(
        string analysisNumber,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LabAnalysis>> GetBySampleIdAsync(
        int sampleId,
        CancellationToken cancellationToken = default);
}