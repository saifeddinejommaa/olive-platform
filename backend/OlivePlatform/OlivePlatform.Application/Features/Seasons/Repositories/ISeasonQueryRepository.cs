using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons.Requests;
using OlivePlatform.Application.Features.Seasons.Responses;

namespace OlivePlatform.Application.Features.Seasons.Repositories
{
    public interface ISeasonQueryRepository
    {
        Task<PagedResult<SeasonForListResponse>> GetSeasons(
            SeasonsRequestFilter filter,
            CancellationToken cancellationToken = default);

        Task<SeasonDetailsResponse?> GetSeasonDetails(
            int id,
            CancellationToken cancellationToken = default);

        // Campagne contenant la date du jour.
        Task<SeasonDetailsResponse?> GetCurrentSeason(
            CancellationToken cancellationToken = default);
    }
}
