using Dapper;
using OlivePlatform.Application.Features.Customers.Repositories;
using OlivePlatform.Application.Features.Customers.Requests;
using OlivePlatform.Application.Features.Customers.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class CustomerQueryRepository : ICustomerQueryRepository
{
    private readonly IDbConnection _dbConnection;

    // Client avec ses ventes livrées (nombre, litres, chiffre d'affaires TTC).
    private const string CustomerSelect = $"""
        SELECT
            c.id AS {nameof(CustomerResponse.Id)},
            c.reference AS {nameof(CustomerResponse.Reference)},
            c.name AS {nameof(CustomerResponse.Name)},
            c.phone AS {nameof(CustomerResponse.Phone)},
            c.email AS {nameof(CustomerResponse.Email)},
            c.tax_id AS {nameof(CustomerResponse.TaxId)},
            c.address AS {nameof(CustomerResponse.Address)},
            c.notes AS {nameof(CustomerResponse.Notes)},
            c.is_active AS {nameof(CustomerResponse.IsActive)},
            COALESCE(sales.sales_count, 0) AS {nameof(CustomerResponse.SalesCount)},
            COALESCE(sales.sold_liters, 0) AS {nameof(CustomerResponse.SoldLiters)},
            COALESCE(sales.sales_amount, 0) AS {nameof(CustomerResponse.SalesAmount)}

        FROM customers c

        LEFT JOIN LATERAL (
            SELECT
                COUNT(DISTINCT s.id)::int AS sales_count,
                SUM(l.quantity_liters) AS sold_liters,
                (SELECT SUM(s2.total_amount) FROM oil_sales s2
                 WHERE s2.customer_id = c.id AND s2.status_id = 2) AS sales_amount
            FROM oil_sales s
            INNER JOIN oil_sale_lines l ON l.oil_sale_id = s.id
            WHERE s.customer_id = c.id
              AND s.status_id = 2
        ) sales ON TRUE
        """;

    public CustomerQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetCustomersAsync(
        CustomersRequestFilter filter,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(CustomerSelect);

        sql.Append("""

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            sql.Append("""

                AND (
                    c.reference ILIKE @Search
                    OR c.name ILIKE @Search
                    OR c.phone ILIKE @Search
                    OR c.tax_id ILIKE @Search
                )
                """);

            parameters.Add("Search", $"%{filter.Search.Trim()}%");
        }

        if (filter.IsActive.HasValue)
        {
            sql.Append("""

                AND c.is_active = @IsActive
                """);

            parameters.Add("IsActive", filter.IsActive.Value);
        }

        sql.Append("""

            ORDER BY c.name
            """);

        using var connection = _dbConnection;

        return (await connection.QueryAsync<CustomerResponse>(
            new CommandDefinition(sql.ToString(), parameters, cancellationToken: cancellationToken))).ToList();
    }

    public async Task<CustomerResponse?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            {CustomerSelect}
            WHERE c.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<CustomerResponse>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken));
    }
}
