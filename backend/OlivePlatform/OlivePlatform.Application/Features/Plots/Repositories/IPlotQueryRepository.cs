using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Application.Features.Plots.Repositories;

public interface IPlotQueryRepository
{
    Task<PagedResult<PlotForListResponse>> GetPlots(
        PlotsRequestFilter filter);

    Task<PlotForDetailsResponse?> GetPlotById(
        int id);
}