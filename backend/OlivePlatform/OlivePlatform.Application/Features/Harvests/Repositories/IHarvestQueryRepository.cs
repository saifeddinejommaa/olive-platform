using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IHarvestQueryRepository
{
    Task<PagedResult<HarvestForListResponse>> GetHarvests(
        HarvestsRequestFilter filter);

    Task<OliveAnalysisDetailsResponse?> GetAnalysisDetails(int id, 
        CancellationToken cancellationToken = default);

    Task<HarvestDetailsResponse?> GetHarvestDetails(
    int id,
    CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Harvest>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default);

    // Ouvriers déjà saisis sur les lignes de coût, filtrés par nom ou identifiant.
    Task<IReadOnlyList<WorkerSuggestionResponse>> SearchWorkers(
        string? search,
        int limit,
        CancellationToken cancellationToken = default);
}