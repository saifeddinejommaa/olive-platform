using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Harvests.Commands.CloseHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.CreateHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.StartHarvest;
using OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Domain.Entities;
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

    // GET: api/Harvest
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] HarvestsRequestFilter filter)
    {
        return Ok(await _harvestQueryRepository.GetHarvests(filter));
    }

    // GET: api/Harvest/5
    [HttpGet("{id:int}")]
    [ProducesResponseType(
        typeof(Harvest),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Harvest>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var harvest =
            await _harvestQueryRepository.GetByIdAsync(
                id,
                cancellationToken);

        if (harvest is null)
        {
            return NotFound();
        }

        return Ok(harvest);
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
        await _mediator.Send(
            new StartHarvestCommand
            {
                Id = id
            },
            cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/close")]
    public async Task<IActionResult> Close(
        int id,
        [FromBody] CloseHarvestCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        await _mediator.Send(
            command,
            cancellationToken);

        return NoContent();
    }


}