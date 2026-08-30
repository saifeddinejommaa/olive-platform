using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Analysis.Commands;
using OlivePlatform.Application.Features.Analysis.Repositories;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Api.Controllers
{
    [ApiController]
    [Route("api/analyses")]
    public class AnalysisController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IOliveAnalysisRepository _oliveAnalysisRepository;
        private readonly IOliveAnalysisQueryRepository _oliveAnalysisQueryRepository;

        private readonly IOilAnalysisRepository _oilAnalysisRepository;

        public AnalysisController(IMediator mediator,
                                IOliveAnalysisRepository oliveAnalysisRepository,
                                IOliveAnalysisQueryRepository oliveAnalysisQueryRepository,
                                IOilAnalysisRepository oilAnalysisRepository)
        {
            _mediator = mediator;
            _oliveAnalysisRepository = oliveAnalysisRepository;
            _oilAnalysisRepository = oilAnalysisRepository;
            _oliveAnalysisQueryRepository = oliveAnalysisQueryRepository;
        }

        [HttpGet("olive/all")]
        public async Task<IActionResult> GetAllOliveAnalyses(
            [FromQuery] OliveAnalysesRequestFilter filter,
        CancellationToken cancellationToken)
        {
            var analysis =
             await _oliveAnalysisQueryRepository.GetOliveAnalysisList(filter, cancellationToken);

            if (analysis is null)
            {
                return NotFound();
            }

            return Ok(analysis);
        }

        [HttpGet("olive/{id:int}")]
        public async Task<IActionResult> GetOliveAnalysisDetails(
            int id,
            CancellationToken cancellationToken)
        {
            var analysis =
             await _oliveAnalysisQueryRepository.GetOliveAnalysisDetails(id,
                 cancellationToken);

            if (analysis is null)
            {
                return NotFound();
            }

            return Ok(analysis);
        }

        [HttpPost("olive")]
        public async Task<IActionResult> CreateOliveAnalysis(
            [FromBody] CreateOliveAnalysisCommand command,
            CancellationToken cancellationToken)
        {
            var id = await _mediator.Send(command, cancellationToken);
            return Ok(new { id });
        }

        [HttpPost("oil")]
        public async Task<IActionResult> CreateOilAnalysis(
            [FromBody] CreateOilAnalysisCommand command,
            CancellationToken cancellationToken)
        {
            var id = await _mediator.Send(command, cancellationToken);
            return Ok(new { id });
        }

        [HttpGet("oil/{id:int}")]
        public async Task<IActionResult> GetOilAnalysisDetails(
            int id,
            CancellationToken cancellationToken)
        {
            var analysis = await _oilAnalysisRepository.GetByIdAsync(
                id,
                cancellationToken);

            return Ok(analysis);
        }
    }
}
