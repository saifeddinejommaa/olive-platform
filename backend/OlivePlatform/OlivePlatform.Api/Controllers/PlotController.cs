using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlotController : ControllerBase
{
    private readonly IPlotQueryRepository _plotQueryRepository;

    public PlotController(
        IPlotQueryRepository plotQueryRepository)
    {
        _plotQueryRepository = plotQueryRepository;
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
    public async Task<IActionResult> GetPlotById(
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
}