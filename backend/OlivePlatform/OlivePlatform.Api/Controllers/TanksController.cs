using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Tanks.Commands;
using OlivePlatform.Application.Features.Tanks.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController : ControllerBase
{
    private readonly ITankQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public TanksController(
        ITankQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] TanksRequestFilter filter)
    {
        return Ok(await _queryRepository.GetTanks(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateTankCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateTankCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}