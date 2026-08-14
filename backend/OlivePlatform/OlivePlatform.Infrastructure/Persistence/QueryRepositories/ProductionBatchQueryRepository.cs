using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class ProductionBatchQueryRepository : IProductionBatchQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public ProductionBatchQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<PagedResult<ProductionBatchForListResponse>> GetProductionBatches(
        ProductionBatchesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                p.id AS Id,
                p.batch_number AS BatchNumber,
                p.production_date AS ProductionDate,
                p.start_time AS StartTime,
                p.end_time AS EndTime,
                p.status_id AS Status,
                p.olive_quantity_kg AS OliveQuantityKg,
                p.oil_quantity_liters AS OilQuantityLiters,
                p.yield_percentage AS YieldPercentage

            FROM production_batches p

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
        // BatchNumber
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.BatchNumber))
        {
            sql.Append(
                """
                
                AND p.batch_number ILIKE @BatchNumber
                """);

            parameters.Add(
                "BatchNumber",
                $"%{filter.BatchNumber}%");
        }

        // ----------------------------------------------------
        // Status
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Status))
        {
            sql.Append(
                """
                
                AND p.status::text = @Status
                """);

            parameters.Add(
                "Status",
                filter.Status);
        }

        // ----------------------------------------------------
        // Production Date
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """
                
                AND p.production_date >= @ProductionDateFrom
                """);

            parameters.Add(
                "ProductionDateFrom",
                filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """
                
                AND p.production_date <= @ProductionDateTo
                """);

            parameters.Add(
                "ProductionDateTo",
                filter.ToDate.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """
            
            ORDER BY p.production_date DESC, p.batch_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<ProductionBatchForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<ProductionBatchForListResponse>
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

    public async Task<ProductionBatch?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                batch_number AS BatchNumber,
                production_date AS ProductionDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM production_batches

            WHERE id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<ProductionBatch>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<ProductionBatch>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                batch_number AS BatchNumber,
                production_date AS ProductionDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM production_batches

            ORDER BY production_date DESC, batch_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<ProductionBatch>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY BATCH NUMBER
    // ============================================================

    public async Task<ProductionBatch?> GetByBatchNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                id AS Id,
                batch_number AS BatchNumber,
                production_date AS ProductionDate,
                start_time AS StartTime,
                end_time AS EndTime,
                status AS Status,
                olive_quantity_kg AS OliveQuantityKg,
                oil_quantity_liters AS OilQuantityLiters,
                yield_percentage AS YieldPercentage,
                notes AS Notes,
                created_at AS CreatedAt,
                updated_at AS UpdatedAt

            FROM production_batches

            WHERE batch_number = @BatchNumber
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<ProductionBatch>(
            sql,
            new
            {
                BatchNumber = batchNumber
            });
    }
}