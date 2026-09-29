using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.OilMovements.Commands;
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
    // Transfert entre deux citernes de stockage de la même catégorie.
    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer(
        [FromBody] TransferOilBetweenTanksCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    // Après l'analyse : huile de la citerne tampon vers la citerne de stockage.
    [HttpPost("transfer-to-storage")]
    public async Task<IActionResult> TransferToStorage(
        [FromBody] TransferOilToStorageCommand command)
    {
        return Ok(await _mediator.Send(command));
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