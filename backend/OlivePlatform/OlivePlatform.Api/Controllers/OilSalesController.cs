using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OilSales.Commands;
using OlivePlatform.Application.Features.OilSales.Repositories;
using OlivePlatform.Application.Features.OilSales.Requests;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/oil-sales")]
public class OilSalesController : ControllerBase
{
    private readonly IOilSaleQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public OilSalesController(
        IOilSaleQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OilSalesRequestFilter filter,
        CancellationToken cancellationToken)
    {
        return Ok(await _queryRepository.GetOilSalesAsync(filter, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _queryRepository.GetDetailsAsync(id, cancellationToken);

        return result is null ? NotFound() : Ok(result);
    }

    // Création en brouillon : le stock ne bouge pas.
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOilSaleCommand command,
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }

    // Modification : seulement en brouillon.
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateOilSaleCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command, cancellationToken));
    }

    // Livraison : l'huile sort des citernes.
    // Avec, en option, le paiement reçu à l'enlèvement.
    [HttpPost("{id:int}/deliver")]
    public async Task<IActionResult> Deliver(
        int id,
        [FromBody] DeliverOilSaleCommand? command,
        CancellationToken cancellationToken)
    {
        command ??= new DeliverOilSaleCommand();
        command.Id = id;

        await _mediator.Send(command, cancellationToken);

        return NoContent();
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new CancelOilSaleCommand { Id = id }, cancellationToken);

        return NoContent();
    }
}
