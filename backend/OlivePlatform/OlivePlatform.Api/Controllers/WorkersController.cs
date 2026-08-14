using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Workers.Commands;
using OlivePlatform.Application.Features.Workers.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkersController : ControllerBase
{
    private readonly IWorkerQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public WorkersController(
        IWorkerQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] WorkersRequestFilter filter)
    {
        return Ok(await _queryRepository.GetWorkers(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateWorkerCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateWorkerCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}