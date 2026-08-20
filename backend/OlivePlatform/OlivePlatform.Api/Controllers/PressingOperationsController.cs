using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.ProductionBatches.Commands;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PressingOperationsController : ControllerBase
{
    private readonly IPressiongOperationQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public PressingOperationsController(
        IPressiongOperationQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PressingOperationsRequestFilter filter)
    {
        return Ok(await _queryRepository.GetPressingOperations(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create(
        [FromBody] CreatePressingOperationCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatePressingOperationCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}