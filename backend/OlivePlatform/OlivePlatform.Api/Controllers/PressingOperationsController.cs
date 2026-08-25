using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Production.Commands;
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
    public async Task<IActionResult> GetDetails(int id)
    {
        return Ok(await _queryRepository.GetPressingOperationDetails(id));
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create(
        [FromBody] CreatePressingOperationCommand command)
    {
        return Ok(await _mediator.Send(command));
    }



    [HttpPut("update")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatePressingOperationCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }

    [HttpPut("start")]
    public async Task<IActionResult> Start(
        int id,
        [FromBody] StartPressingOperationCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }

    [HttpPut("close")]
    public async Task<IActionResult> Close(
        int id,
        [FromBody] ClosePressingOperationCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }

    [HttpPut("cancel")]
    public async Task<IActionResult> Cancel(
        int id,
        [FromBody] CancelPressingOperationCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}