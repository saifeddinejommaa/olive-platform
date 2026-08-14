using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface ILabAnalysisResultRepository
    : IRepository<LabAnalysisResult>
{
    Task<IReadOnlyList<LabAnalysisResult>> GetByAnalysisIdAsync(
        int analysisId,
        CancellationToken cancellationToken = default);

    Task DeleteByAnalysisIdAsync(
        int analysisId,
        CancellationToken cancellationToken = default);
}