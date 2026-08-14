using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface ILabAnalysisResultQueryRepository
{

    Task<LabAnalysisResult?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LabAnalysisResult>> GetByAnalysisIdAsync(
        int analysisId,
        CancellationToken cancellationToken = default);
}