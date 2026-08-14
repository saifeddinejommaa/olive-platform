using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.ExpenseCategories.Requests;
using OlivePlatform.Application.Features.ExpenseCategories.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class ExpenseCategoryQueryRepository : IExpenseCategoryQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public ExpenseCategoryQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET EXPENSE CATEGORIES - PAGINATED
    // ============================================================

    public async Task<PagedResult<ExpenseCategoryForListResponse>> GetExpenseCategories(
        ExpenseCategoriesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                ec.id AS Id,
                ec.code AS Code,
                ec.name AS Name,
                ec.parent_id AS ParentId,
                ec.description AS Description

            FROM expense_categories ec

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ----------------------------------------------------
        // Code
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Code))
        {
            sql.Append(
                """
                
                AND ec.code ILIKE @Code
                """);

            parameters.Add(
                "Code",
                $"%{filter.Code}%");
        }

        // ----------------------------------------------------
        // Name
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            sql.Append(
                """
                
                AND ec.name ILIKE @Name
                """);

            parameters.Add(
                "Name",
                $"%{filter.Name}%");
        }

        // ----------------------------------------------------
        // ParentId
        // ----------------------------------------------------

        if (filter.ParentId.HasValue)
        {
            sql.Append(
                """
                
                AND ec.parent_id = @ParentId
                """);

            parameters.Add(
                "ParentId",
                filter.ParentId.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """
            
            ORDER BY ec.code

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<ExpenseCategoryForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<ExpenseCategoryForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<ExpenseCategory?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ec.id AS Id,
                ec.code AS Code,
                ec.name AS Name,
                ec.parent_id AS ParentId,
                ec.description AS Description,
                ec.created_at AS CreatedAt

            FROM expense_categories ec

            WHERE ec.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<ExpenseCategory>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<ExpenseCategory>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ec.id AS Id,
                ec.code AS Code,
                ec.name AS Name,
                ec.parent_id AS ParentId,
                ec.description AS Description,
                ec.created_at AS CreatedAt

            FROM expense_categories ec

            ORDER BY ec.code
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<ExpenseCategory>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY CODE
    // ============================================================

    public async Task<ExpenseCategory?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ec.id AS Id,
                ec.code AS Code,
                ec.name AS Name,
                ec.parent_id AS ParentId,
                ec.description AS Description,
                ec.created_at AS CreatedAt

            FROM expense_categories ec

            WHERE ec.code = @Code
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<ExpenseCategory>(
            sql,
            new
            {
                Code = code
            });
    }
}