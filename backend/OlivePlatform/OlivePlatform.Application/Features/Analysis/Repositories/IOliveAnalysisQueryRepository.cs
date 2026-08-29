using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Laboratory.Requests;

namespace OlivePlatform.Application.Features.Analysis.Repositories
{
    public interface IOliveAnalysisQueryRepository
    {
        Task<OliveAnalysisDetailsResponse> GetOliveAnalysisDetails(
        HarvestsRequestFilter filter);

        Task<PagedResult<OliveAnalysisForListResponse>> GetOliveAnalysisList(OliveAnalysesRequestFilter filter, CancellationToken cancellationToken); 
    }
}
