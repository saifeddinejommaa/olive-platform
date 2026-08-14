using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Invoices.Commands;
using OlivePlatform.Application.Features.Invoices.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public InvoicesController(
        IInvoiceQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] InvoicesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetInvoices(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetInvoiceById(id);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateInvoiceCommand command)
    {
        return Ok(await _mediator.Send(command));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateInvoiceCommand command)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command));
    }
}