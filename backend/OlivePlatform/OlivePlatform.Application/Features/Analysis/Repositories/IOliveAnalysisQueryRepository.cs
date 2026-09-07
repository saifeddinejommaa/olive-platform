using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Requests;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Laboratory.Requests;

namespace OlivePlatform.Application.Features.Analysis.Repositories
{
    public interface IOliveAnalysisQueryRepository
    {
        Task<OliveAnalysisDetailsResponse> GetOliveAnalysisDetails(
       int id, CancellationToken cancellationToken);

        Task<PagedResult<OliveAnalysisForListResponse>> GetOliveAnalysisList(OliveAnalysesRequestFilter filter, CancellationToken cancellationToken); 
    }
}
