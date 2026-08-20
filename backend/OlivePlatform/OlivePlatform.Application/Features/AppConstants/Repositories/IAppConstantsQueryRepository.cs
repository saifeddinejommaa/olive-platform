using OlivePlatform.Application.Features.AppConstants.Responses;

namespace OlivePlatform.Application.Features.AppConstants.Repositories
{
    public interface IAppConstantsQueryRepository
    {
        Task<AppConstantsResponse> GetAppConstants(
       CancellationToken cancellationToken = default);
    }
}
