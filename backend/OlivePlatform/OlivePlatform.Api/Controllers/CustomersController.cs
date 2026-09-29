using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.Customers.Commands;
using OlivePlatform.Application.Features.Customers.Repositories;
using OlivePlatform.Application.Features.Customers.Requests;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public CustomersController(
        ICustomerQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] CustomersRequestFilter filter,
        CancellationToken cancellationToken)
    {
        return Ok(await _queryRepository.GetCustomersAsync(filter, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _queryRepository.GetByIdAsync(id, cancellationToken);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        return Ok(await _mediator.Send(command, cancellationToken));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateCustomerCommand command,
        CancellationToken cancellationToken)
    {
        command.Id = id;

        return Ok(await _mediator.Send(command, cancellationToken));
    }
}
