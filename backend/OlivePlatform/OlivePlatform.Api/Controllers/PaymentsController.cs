using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Payments.Commands;
using OlivePlatform.Application.Features.Payments.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public PaymentsController(
        IPaymentQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] PaymentsRequestFilter filter)
    {
        return Ok(await _queryRepository.GetPayments(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreatePaymentCommand command)
    {
        return Ok(await _mediator.Send(command));
    }
}