using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OlivePurchases.Commands.CreateOlivePurchase;
using OlivePlatform.Application.Features.OlivePurchases.Commands.UpdateOlivePurchase;
using OlivePlatform.Application.Features.OlivePurchases.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OlivePurchasesController : ControllerBase
{
    private readonly IOlivePurchaseQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public OlivePurchasesController(
        IOlivePurchaseQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OlivePurchasesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetOlivePurchases(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetOlivePurchaseById(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOlivePurchaseCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateOlivePurchaseCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}