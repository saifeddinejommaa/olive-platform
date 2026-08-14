using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilBatches.Requests;
using OlivePlatform.Application.Features.OilBatches.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OilBatchQueryRepository : IOilBatchQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public OilBatchQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET OIL BATCHES - PAGINATED
    // ============================================================

    public async Task<PagedResult<OilBatchForListResponse>> GetOilBatches(
        OilBatchesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                ob.id AS Id,
                ob.batch_number AS BatchNumber,

                ob.production_batch_id AS ProductionBatchId,
                pb.batch_number AS ProductionBatchNumber,

                ob.production_date AS ProductionDate,
                ob.quantity_liters AS QuantityLiters,

                ob.quality_grade AS QualityGrade,
                ob.status AS Status

            FROM oil_batches ob

            INNER JOIN production_batches pb
                ON pb.id = ob.production_batch_id

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
        // Batch Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.BatchNumber))
        {
            sql.Append(
                """

                AND ob.batch_number ILIKE @BatchNumber
                """);

            parameters.Add(
                "BatchNumber",
                $"%{filter.BatchNumber}%");
        }

        // ----------------------------------------------------
        // Production Batch Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.ProductionBatchNumber))
        {
            sql.Append(
                """

                AND pb.batch_number ILIKE @ProductionBatchNumber
                """);

            parameters.Add(
                "ProductionBatchNumber",
                $"%{filter.ProductionBatchNumber}%");
        }

        // ----------------------------------------------------
        // Quality Grade
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.QualityGrade))
        {
            sql.Append(
                """

                AND ob.quality_grade ILIKE @QualityGrade
                """);

            parameters.Add(
                "QualityGrade",
                $"%{filter.QualityGrade}%");
        }

        // ----------------------------------------------------
        // Status
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Status))
        {
            sql.Append(
                """

                AND ob.status = @Status
                """);

            parameters.Add(
                "Status",
                filter.Status);
        }

        // ----------------------------------------------------
        // Production Date From
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND ob.production_date >= @ProductionDateFrom
                """);

            parameters.Add(
                "ProductionDateFrom",
                filter.FromDate.Value);
        }

        // ----------------------------------------------------
        // Production Date To
        // ----------------------------------------------------

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND ob.production_date <= @ProductionDateTo
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

            ORDER BY
                ob.production_date DESC,
                ob.batch_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OilBatchForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<OilBatchForListResponse>
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

    public async Task<OilBatch?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ob.id AS Id,
                ob.batch_number AS BatchNumber,

                ob.production_batch_id AS ProductionBatchId,

                ob.production_date AS ProductionDate,
                ob.quantity_liters AS QuantityLiters,

                ob.quality_grade AS QualityGrade,
                ob.status AS Status,

                ob.notes AS Notes,

                ob.created_at AS CreatedAt,
                ob.updated_at AS UpdatedAt

            FROM oil_batches ob

            WHERE ob.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OilBatch>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<OilBatch>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ob.id AS Id,
                ob.batch_number AS BatchNumber,

                ob.production_batch_id AS ProductionBatchId,

                ob.production_date AS ProductionDate,
                ob.quantity_liters AS QuantityLiters,

                ob.quality_grade AS QualityGrade,
                ob.status AS Status,

                ob.notes AS Notes,

                ob.created_at AS CreatedAt,
                ob.updated_at AS UpdatedAt

            FROM oil_batches ob

            ORDER BY
                ob.production_date DESC,
                ob.batch_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OilBatch>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY BATCH NUMBER
    // ============================================================

    public async Task<OilBatch?> GetByBatchNumberAsync(
        string batchNumber,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                ob.id AS Id,
                ob.batch_number AS BatchNumber,

                ob.production_batch_id AS ProductionBatchId,

                ob.production_date AS ProductionDate,
                ob.quantity_liters AS QuantityLiters,

                ob.quality_grade AS QualityGrade,
                ob.status AS Status,

                ob.notes AS Notes,

                ob.created_at AS CreatedAt,
                ob.updated_at AS UpdatedAt

            FROM oil_batches ob

            WHERE ob.batch_number = @BatchNumber
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OilBatch>(
            sql,
            new
            {
                BatchNumber = batchNumber
            });
    }
}