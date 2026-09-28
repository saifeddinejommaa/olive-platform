using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OliveLots.Commands;
using OlivePlatform.Application.Features.OliveLots.Repositories;
using OlivePlatform.Application.Features.OliveLots.Requests;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/olive-lots")]
public class OliveLotsController : ControllerBase
{
    private readonly IOliveLotQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public OliveLotsController(
        IOliveLotQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OliveLotsRequestFilter filter,
        CancellationToken cancellationToken)
    {
        return Ok(await _queryRepository.GetLots(filter, cancellationToken));
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(
        long id,
        CancellationToken cancellationToken)
    {
        var lot = await _queryRepository.GetLot(id, cancellationToken);

        return lot is null ? NotFound() : Ok(lot);
    }

    // « Passer sans analyse ».
    [HttpPost("{id:long}/skip-analysis")]
    public async Task<IActionResult> SkipAnalysis(
        long id,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new SkipOliveLotAnalysisCommand { Id = id },
            cancellationToken);

        return NoContent();
    }
}
