using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Application.Features.Plots.Repositories;

public interface IPlotQueryRepository 
{
    Task<PagedResult<PlotForListResponse>> GetPagedListAsync(PlotsRequestFilter parameters);

    Task<PlotDetailResponse?> GetDetailAsync(int id);

}