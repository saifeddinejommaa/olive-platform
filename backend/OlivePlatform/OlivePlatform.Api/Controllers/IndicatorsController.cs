using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Indicators.Repositories;

namespace OlivePlatform.Api.Controllers;

// Indicateurs de décision de la campagne (calculés, pas estimés).
[ApiController]
[Route("api/indicators")]
public class IndicatorsController : ControllerBase
{
    private readonly IIndicatorQueryRepository _queryRepository;

    public IndicatorsController(IIndicatorQueryRepository queryRepository)
    {
        _queryRepository = queryRepository;
    }

    // Rendements par variété, parcelle, fournisseur et mois.
    [HttpGet("yields")]
    public async Task<IActionResult> GetYields(
        [FromQuery] int? seasonId,
        CancellationToken cancellationToken)
    {
        return Ok(await _queryRepository.GetYieldsAsync(seasonId, cancellationToken));
    }
}
