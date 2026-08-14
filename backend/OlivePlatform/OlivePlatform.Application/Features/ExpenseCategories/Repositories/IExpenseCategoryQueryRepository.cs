using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.ExpenseCategories.Requests;
using OlivePlatform.Application.Features.ExpenseCategories.Responses;
using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.QueryRepositories;

public interface IExpenseCategoryQueryRepository
{
    Task<PagedResult<ExpenseCategoryForListResponse>> GetExpenseCategories(
        ExpenseCategoriesRequestFilter filter);

    Task<ExpenseCategory?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ExpenseCategory>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<ExpenseCategory?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default);
}