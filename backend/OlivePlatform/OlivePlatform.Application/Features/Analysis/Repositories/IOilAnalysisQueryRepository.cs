using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Requests;
using OlivePlatform.Application.Features.Analysis.Responses;

namespace OlivePlatform.Application.Features.Analysis.Repositories
{
    public interface IOilAnalysisQueryRepository
    {

        Task<OilAnalysisDetailsResponse> GetOilAnalysisDetails(int id, 
                                            CancellationToken cancellationToken);

        Task<PagedResult<OilAnalysisForListResponse>> GetOilAnalysisList(OilAnalysesRequestFilter filter,
                                                            CancellationToken cancellationToken);
    }
}
