using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Plots.Commands;
using OlivePlatform.Application.Features.Plots.Repositories;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlotsController : ControllerBase
{
    private readonly IPlotQueryRepository _plotQueryRepository;
    private readonly IPlotRepository _plotRepository;
    private readonly IMediator _mediator;

    public PlotsController(
        IPlotQueryRepository plotQueryRepository,
        IPlotRepository plotRepository,
        IMediator mediator)
    {
        _plotQueryRepository = plotQueryRepository;
        _plotRepository = plotRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlots(
        [FromQuery] PlotsRequestFilter filter,
        CancellationToken cancellationToken)
    {
        var result =
            await _plotQueryRepository.GetPlots(filter);

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDetails(
        int id,
        CancellationToken cancellationToken)
    {
        var result =
            await _plotQueryRepository.GetPlotById(id);

        if (result is null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpGet("available-trees")]
    public async Task<ActionResult<int>> GetAvailableTrees(
       [FromQuery] int plotId,
       [FromQuery] int varietyId,
       [FromQuery] DateOnly harvestDate,
       CancellationToken cancellationToken)
    {
        var availableTrees = await _plotRepository.GetAvailableTreesAsync(
            plotId,
            varietyId,
            harvestDate,
            cancellationToken);

        return Ok(availableTrees);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatePlotCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        await _mediator.Send(
            command,
            cancellationToken);

        return Ok(true);
    }

    [HttpPut("varieties/{id:int}")]
    public async Task<IActionResult> UpdateVariety(
    int id,
    [FromBody] UpdatePlotVarietyCommand command,
    CancellationToken cancellationToken)
    {
        command.Id = id;

        await _mediator.Send(
            command,
            cancellationToken);

        return Ok(true);
    }
}