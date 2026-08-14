using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Application.Features.Laboratory.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface ILabAnalysisQueryRepository
{
    Task<PagedResult<LabAnalysisForListResponse>> GetLabAnalyses(
        LabAnalysesRequestFilter filter);

    

    Task<LabAnalysis?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LabAnalysis>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<LabAnalysis?> GetBySampleIdAsync(
        int sampleId,
        CancellationToken cancellationToken = default);
}