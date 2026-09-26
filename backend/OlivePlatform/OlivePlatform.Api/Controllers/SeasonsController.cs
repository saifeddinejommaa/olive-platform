using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Seasons.Commands;
using OlivePlatform.Application.Features.Seasons.Repositories;
using OlivePlatform.Application.Features.Seasons.Requests;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeasonsController : ControllerBase
{
    private readonly ISeasonQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public SeasonsController(
        ISeasonQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] SeasonsRequestFilter filter,
        CancellationToken cancellationToken)
    {
        return Ok(await _queryRepository.GetSeasons(filter, cancellationToken));
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent(
        CancellationToken cancellationToken)
    {
        var result = await _queryRepository.GetCurrentSeason(cancellationToken);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await _queryRepository.GetSeasonDetails(id, cancellationToken);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("{id:int}/close")]
    public async Task<IActionResult> Close(int id)
    {
        return Ok(await _mediator.Send(new CloseSeasonCommand { Id = id }));
    }

    [HttpPost("{id:int}/reopen")]
    public async Task<IActionResult> Reopen(int id)
    {
        return Ok(await _mediator.Send(new ReopenSeasonCommand { Id = id }));
    }
}
