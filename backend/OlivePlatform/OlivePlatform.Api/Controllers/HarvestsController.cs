using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Invoices.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HarvestsController : ControllerBase
{
    private readonly IHarvestQueryRepository _harvestQueryRepository;

    public HarvestsController(
        IHarvestQueryRepository harvestQueryRepository)
    {
        _harvestQueryRepository =
            harvestQueryRepository;
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

    // GET: api/Harvest/plot/5
    [HttpGet("plot/{plotId:int}")]
    [ProducesResponseType(
        typeof(IReadOnlyList<Harvest>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<Harvest>>> GetByPlotId(
        int plotId,
        CancellationToken cancellationToken)
    {
        var harvests =
            await _harvestQueryRepository.GetByPlotIdAsync(
                plotId,
                cancellationToken);

        return Ok(harvests);
    }
}