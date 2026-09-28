using OlivePlatform.Application.Features.OliveLots.Requests;
using OlivePlatform.Application.Features.OliveLots.Responses;

namespace OlivePlatform.Application.Features.OliveLots.Repositories;

public interface IOliveLotQueryRepository
{
    Task<List<OliveLotResponse>> GetLots(
        OliveLotsRequestFilter filter,
        CancellationToken cancellationToken = default);

    Task<OliveLotResponse?> GetLot(
        long id,
        CancellationToken cancellationToken = default);
}
