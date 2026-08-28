using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Harvests.Commands.CloseHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.CreateHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.StartHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HarvestsController : ControllerBase
{
    private readonly IHarvestQueryRepository _harvestQueryRepository;
    private readonly IMediator _mediator;

    public HarvestsController(
        IHarvestQueryRepository harvestQueryRepository,
        IMediator mediator)
    {
        _harvestQueryRepository =
            harvestQueryRepository;
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
    public async Task<ActionResult> GetHarvestStocks(
        int id,
        HarvestStocksRequestFilter filter,
        CancellationToken cancellationToken)
    {
        var stocks =
            await _harvestQueryRepository.GetHarvestStocks(id,filter,
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
        CancellationToken cancellationToken)
    {
        var command = new StartHarvestCommand
        {
            Id = id
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


}