using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Application.Features.Plots.Repositories;

public interface IPlotQueryRepository 
{
    Task<PagedResult<PlotForListResponse>> GetPagedListAsync(PlotsRequestFilter parameters);

    // Avancement de la récolte calculé sur la campagne (toutes si seasonId est null).
    Task<PlotDetailResponse?> GetDetailAsync(int id, int? seasonId = null);

    Task<PlotVarietyDetail?> GetPlotVarieties(int plotId, int varietyId, int? seasonId = null);

}