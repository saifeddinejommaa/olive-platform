using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IPlotQueryRepository
{
    Task<PagedResult<PlotForListResponse>> GetPlots(
        PlotsRequestFilter filter);

    Task<PlotForDetailsResponse?> GetPlotById(
        int id);
}