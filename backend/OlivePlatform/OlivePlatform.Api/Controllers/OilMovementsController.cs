using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OilMovements.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OilMovementsController : ControllerBase
{
    private readonly IOilMovementQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public OilMovementsController(
        IOilMovementQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OilMovementsRequestFilter filter)
    {
        return Ok(await _queryRepository.GetOilMovements(filter));
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
        [FromBody] CreateOilMovementCommand command)
    {
        return Ok(await _mediator.Send(command));
    }
    */
}