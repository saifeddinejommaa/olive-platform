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
    private readonly IPaymentQueryRepository _paymentQueryRepository;
    private readonly IMediator _mediator;

    public PaymentsController(IPaymentQueryRepository paymentQueryRepository, IMediator mediator)
    {
        _paymentQueryRepository = paymentQueryRepository;
        _mediator = mediator;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending(
        [FromQuery] PendingPaymentFilter filter,
        CancellationToken cancellationToken)
    {
        var result = await _paymentQueryRepository.GetPendingPayments(filter,cancellationToken);
        return Ok(result);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] PaymentHistoryFilter filter, 
        CancellationToken cancellationToken)
    {
        var result = await _paymentQueryRepository.GetPaymentHistory(filter,cancellationToken);
        return Ok(result);
    }

    [HttpGet("pending-details")]
    public async Task<IActionResult> GetPendingDetails(
        [FromQuery] GetPendingPaymentDetailsRequest filter,
        CancellationToken cancellationToken)
    {
        var result = await _paymentQueryRepository.GetPendingPaymentDetails(filter, cancellationToken);
        return Ok(result);
    }

    [HttpPost("pay")]
    public async Task<IActionResult> Pay(
       [FromBody] PayPaymentsCommand command,
       CancellationToken cancellationToken)
    {
        await _mediator.Send(command, cancellationToken);

        return Ok();
    }
}