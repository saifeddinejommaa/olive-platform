using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Repositories;
using OlivePlatform.Application.Features.Plots.Responses;

namespace OlivePlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlotsController : ControllerBase
    {
        private readonly IPlotQueryRepository _plotQueryRepository;

        public PlotsController(IPlotQueryRepository plotQueryRepository)
        {
            _plotQueryRepository = plotQueryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<PlotForListResponse>>> GetList([FromQuery] PlotsRequestFilter parameters)
        {
            var result = await _plotQueryRepository.GetPagedListAsync(parameters);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PlotDetailResponse>> GetPlotDetails(int id)
        {
            var plot = await _plotQueryRepository.GetDetailAsync(id);
            if (plot is null) return NotFound();
            return Ok(plot);
        }

        [HttpGet("{plotId:int}/available-trees")]
        public async Task<ActionResult<PlotVarietyDetail>> GetAvailableTrees(int plotId, [FromQuery] int varietyId)
        {
            var plot = await _plotQueryRepository.GetPlotVarieties(plotId, varietyId);
            return Ok(plot);
        }
    }
}