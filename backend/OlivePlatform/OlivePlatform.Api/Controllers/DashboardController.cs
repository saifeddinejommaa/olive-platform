using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IDashboardQueryRepository _dashboardQueryRepository;

        public DashboardController(IMediator mediator,
            IDashboardQueryRepository dashboardQueryRepository
                                )
        {
            _mediator = mediator;
            _dashboardQueryRepository = dashboardQueryRepository;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
                [FromQuery] DateTime? harvestYieldFromDate,
                [FromQuery] int pressingComparisonLimit = 10,
                CancellationToken cancellationToken = default)
        {
            var fromDate = harvestYieldFromDate ?? DateTime.UtcNow.AddDays(-30);

            var summary = await _dashboardQueryRepository.GetDashboardSummary(
                fromDate,
                pressingComparisonLimit,
                cancellationToken);

            return Ok(summary);
        }
    }
}
