using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class PressingOperationQueryRepository : IPressiongOperationQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public PressingOperationQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<PagedResult<PressingOperationForListResponse>> GetPressingOperations(
     PressingOperationsRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
        SELECT DISTINCT
            COUNT(*) OVER() AS Total,

            p.id AS Id,
            p.operation_number AS OperationNumber,
            p.start_time AS StartTime,
            p.created_at AS CreatedAt,
            p.end_time AS EndTime,
            p.status_id AS Status,
            p.oil_quantity_liters AS OilQuantityLiters

        FROM pressing_operations p

        LEFT JOIN pressing_operation_inputs poi
            ON poi.pressing_operation_id = p.id

        LEFT JOIN harvests h
            ON h.id = poi.harvest_id

        LEFT JOIN olive_purchase_items opi
            ON opi.id = poi.purchase_item_id

        LEFT JOIN olive_purchases op
            ON op.id = opi.purchase_id

        WHERE 1 = 1
        """);

        var parameters = new DynamicParameters();

        // ========================================================
        // PRESSING NUMBER
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.OperationNumber))
        {
            sql.Append(
                """
            
            AND p.operation_number ILIKE @PressingNumber
            """);

            parameters.Add(
                "PressingNumber",
                $"%{filter.OperationNumber}%");
        }

        // ========================================================
        // HARVEST NUMBER
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.HarvestNumber))
        {
            sql.Append(
                """
            
            AND h.harvest_number ILIKE @HarvestNumber
            """);

            parameters.Add(
                "HarvestNumber",
                $"%{filter.HarvestNumber}%");
        }

        // ========================================================
        // PURCHASE NUMBER
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.PurchaseNumber))
        {
            sql.Append(
                """
            
            AND op.purchase_number ILIKE @PurchaseNumber
            """);

            parameters.Add(
                "PurchaseNumber",
                $"%{filter.PurchaseNumber}%");
        }

        // ========================================================
        // PAGINATION
        // ========================================================

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        sql.Append(
            """
        
        ORDER BY
            p.operation_number

        LIMIT @PageSize
        OFFSET @Offset
        """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<PressingOperationForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<PressingOperationForListResponse>
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

    public async Task<PressingOperation?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                operation_number AS OperationNumber,
                pressing_date AS PressingDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM pressing_operations

            WHERE id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<PressingOperation>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<PressingOperation>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                operation_number AS OperationNumber,
                pressing_date AS PressingDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM pressing_operations

            ORDER BY production_date DESC, batch_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<PressingOperation>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY BATCH NUMBER
    // ============================================================

    public async Task<PressingOperation?> GetByBatchNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                operation_number AS OperationNumber,
                pressing_date AS PressingDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM pressing_operations

            WHERE batch_number = @BatchNumber
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<PressingOperation>(
            sql,
            new
            {
                BatchNumber = batchNumber
            });
    }
}