using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OilBatches.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OilBatchesController : ControllerBase
{
    private readonly IOilBatchQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public OilBatchesController(
        IOilBatchQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OilBatchesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetOilBatches(filter));
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
        [FromBody] CreateOilBatchCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateOilBatchCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
    */
}