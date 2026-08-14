using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.ExpenseCategories.Requests;
using OlivePlatform.Domain.QueryRepositories;

namespace OlivePlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpenseCategoriesController : ControllerBase
{
    private readonly IExpenseCategoryQueryRepository _queryRepository;
    private readonly IMediator _mediator;

    public ExpenseCategoriesController(
        IExpenseCategoryQueryRepository queryRepository,
        IMediator mediator)
    {
        _queryRepository = queryRepository;
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] ExpenseCategoriesRequestFilter filter)
    {
        return Ok(await _queryRepository.GetExpenseCategories(filter));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _queryRepository.GetByIdAsync(id);

        return result is null ? NotFound() : Ok(result);
    }
}