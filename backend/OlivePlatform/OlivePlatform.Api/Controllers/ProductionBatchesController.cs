using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.ProductionBatches.Commands;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductionBatchesController : ControllerBase
{
    private readonly IProductionBatchQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public ProductionBatchesController(
        IProductionBatchQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] ProductionBatchesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetProductionBatches(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateProductionBatchCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateProductionBatchCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}