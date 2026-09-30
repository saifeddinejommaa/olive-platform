using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Harvests.Commands.AddHarvestCostLine;
using OlivePlatform.Application.Features.Harvests.Commands.CloseHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.CreateHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.StartHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.OliveLots.Repositories;
using OlivePlatform.Application.Features.OliveLots.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HarvestsController : ControllerBase
{
    private readonly IHarvestQueryRepository _harvestQueryRepository;
    private readonly IOliveLotQueryRepository _oliveLotQueryRepository;
    private readonly IMediator _mediator;

    public HarvestsController(
        IHarvestQueryRepository harvestQueryRepository,
        IOliveLotQueryRepository oliveLotQueryRepository,
        IMediator mediator)
    {
        _harvestQueryRepository =
            harvestQueryRepository;
        _oliveLotQueryRepository = oliveLotQueryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] HarvestsRequestFilter filter)
    {
        return Ok(await _harvestQueryRepository.GetHarvests(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Harvest>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var harvest =
            await _harvestQueryRepository.GetHarvestDetails(
                id,
                cancellationToken);

        if (harvest is null)
        {
            return NotFound();
        }

        return Ok(harvest);
    }

    [HttpGet("{id:int}/stocks")]
    public async Task<ActionResult> GetHarvestStocksDetails(
        int id,
        CancellationToken cancellationToken)
    {
        // Stocks de la récolte = ses lots d'olives.
        var lots = await _oliveLotQueryRepository.GetLots(
            new OliveLotsRequestFilter { HarvestId = id },
            cancellationToken);

        return Ok(lots);
    }


    [HttpGet("{id:int}/olive-analysis")]
    public async Task<ActionResult> GetHarvestAnalysis(
        int id,
        CancellationToken cancellationToken)
    {
        var stocks =
            await _harvestQueryRepository.GetAnalysisDetails(id,
                cancellationToken);

        if (stocks is null)
        {
            return NotFound();
        }

        return Ok(stocks);
    }


    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateHarvestCommand command,
        CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id },
            new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateHarvestCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        await _mediator.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/start")]
    public async Task<IActionResult> Start(
        int id,
        [FromBody] StartHarvestCommand? body,
        CancellationToken cancellationToken)
    {
        var command = new StartHarvestCommand
        {
            Id = id,
            WeatherAcknowledged = body?.WeatherAcknowledged ?? false
        };

        await _mediator.Send(command,cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/close")]
    public async Task<IActionResult> Close(
        int id,
        [FromBody] CloseHarvestCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        await _mediator.Send(command,cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/cost-lines")]
    public async Task<IActionResult> AddCostLine(
        int id,
        [FromBody] AddHarvestCostLineCommand command,
        CancellationToken cancellationToken)
    {
        command.HarvestId = id;

        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpGet("cost-lines/workers")]
    public async Task<IActionResult> SearchWorkers(
        [FromQuery] string? search,
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default)
    {
        return Ok(await _harvestQueryRepository.SearchWorkers(
            search,
            Math.Clamp(limit, 1, 50),
            cancellationToken));
    }
}