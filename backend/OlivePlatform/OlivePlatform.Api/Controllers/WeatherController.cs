using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Weather;

namespace OlivePlatform.Api.Controllers;

// Météo des parcelles (Visual Crossing, via le serveur : la clé reste secrète).
[ApiController]
[Route("api/weather")]
public class WeatherController : ControllerBase
{
    private readonly IMediator _mediator;

    public WeatherController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Prévisions d'une parcelle (sans plotId : la première parcelle géolocalisée).
    [HttpGet("forecast")]
    public async Task<IActionResult> GetForecast(
        [FromQuery] int? plotId,
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(
            new GetWeatherForecastQuery { PlotId = plotId },
            cancellationToken));
    }

    // Conseil météo pour récolter une parcelle à une date (date au format AAAA-MM-JJ).
    [HttpGet("harvest-advice")]
    public async Task<IActionResult> GetHarvestAdvice(
        [FromQuery] int plotId,
        [FromQuery] DateOnly date,
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(
            new GetHarvestWeatherAdviceQuery { PlotId = plotId, Date = date },
            cancellationToken));
    }

    // Météo du jour avant de lancer une récolte (parcelle de la récolte).
    [HttpGet("harvest-start-check")]
    public async Task<IActionResult> GetHarvestStartCheck(
        [FromQuery] int harvestId,
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(
            new GetHarvestStartCheckQuery { HarvestId = harvestId },
            cancellationToken));
    }
}
