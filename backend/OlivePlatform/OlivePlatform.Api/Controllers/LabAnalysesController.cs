using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LabAnalysesController : ControllerBase
{
    private readonly ILabAnalysisQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public LabAnalysesController(
        ILabAnalysisQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] LabAnalysesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetLabAnalyses(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }
    /*
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateLabAnalysisCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateLabAnalysisCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
    */
}