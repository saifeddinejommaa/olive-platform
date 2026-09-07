using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Analysis.Commands;
using OlivePlatform.Application.Features.Analysis.Repositories;
using OlivePlatform.Application.Features.Analysis.Requests;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Application.Features.OilAnalyses.Commands;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Api.Controllers
{
    [ApiController]
    [Route("api/analyses")]
    public class AnalysisController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IOliveAnalysisQueryRepository _oliveAnalysisQueryRepository;
        private readonly IOilAnalysisQueryRepository _oilAnalysisQueryRepository;

        private readonly IOilAnalysisRepository _oilAnalysisRepository;

        public AnalysisController(IMediator mediator,
                                IOliveAnalysisQueryRepository oliveAnalysisQueryRepository,
                                IOilAnalysisRepository oilAnalysisRepository,
                                IOilAnalysisQueryRepository oilAnalysisQueryRepository)
        {
            _mediator = mediator;
            _oilAnalysisRepository = oilAnalysisRepository;
            _oliveAnalysisQueryRepository = oliveAnalysisQueryRepository;
            _oilAnalysisQueryRepository = oilAnalysisQueryRepository;
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

        [HttpPost("olive/{id:int}/start")]
        public async Task<IActionResult> Start(
            int id,
            CancellationToken cancellationToken)
        {
           var StartOliveAnalyseCommand = new StartOliveAnalyseCommand { Id = id };

            await _mediator.Send(StartOliveAnalyseCommand, cancellationToken);

            return NoContent();
        }

        [HttpGet("oil/all")]
        public async Task<IActionResult> GetAllOilAnalyses(
            [FromQuery] OilAnalysesRequestFilter filter,
        CancellationToken cancellationToken)
        {
            var analysis =
             await _oilAnalysisQueryRepository.GetOilAnalysisList(filter, cancellationToken);

            if (analysis is null)
            {
                return NotFound();
            }

            return Ok(analysis);
        }

        [HttpPut("olive/{id:int}/update")]
        public async Task<IActionResult> Update(
            [FromBody] UpdateOliveAnalyseCommand command,
            int id,
            CancellationToken cancellationToken)
        {

            command.Id = id;
            await _mediator.Send(command, cancellationToken);

            return NoContent();
        }

        [HttpPut("olive/{id:int}/complete")]
        public async Task<IActionResult> Complete(
            [FromBody] CompleteOliveAnalyseCommand command,
            int id,
            CancellationToken cancellationToken)
        {

            command.Id = id;
            await _mediator.Send(command, cancellationToken);

            return NoContent();
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

        [HttpPost("oil")]
        public async Task<IActionResult> Create(
            [FromBody] CreateOilAnalysisCommand command,
            CancellationToken cancellationToken)
        {
            var id = await _mediator.Send(command, cancellationToken);
            return Ok(id);
        }

        [HttpPut("oil/{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateOilAnalysisCommand command,
            CancellationToken cancellationToken)
        {
            command.Id = id;
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }

        [HttpPost("oil/{id:int}/start")]
        public async Task<IActionResult> StartOilAnalysis(
            int id,
            CancellationToken cancellationToken)
        {
            await _mediator.Send(new StartOilAnalysisCommand { Id = id }, cancellationToken);
            return NoContent();
        }

        [HttpPost("oil/{id:int}/complete")]
        public async Task<IActionResult> Complete(
            int id,
            [FromBody] CompleteOilAnalysisCommand command,
            CancellationToken cancellationToken)
        {
            command.Id = id;
            await _mediator.Send(command, cancellationToken);
            return NoContent();
        }
    }
}
