using Dapper;
using Microsoft.EntityFrameworkCore;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OlivePurchases.Requests;
using OlivePlatform.Application.Features.OlivePurchases.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OlivePurchaseQueryRepository : IOlivePurchaseQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public OlivePurchaseQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET OLIVE PURCHASES - PAGINATED
    // ============================================================

    public async Task<PagedResult<OlivePurchaseForListResponse>> GetOlivePurchases(
        OlivePurchasesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                op.id AS Id,
                op.purchase_number AS PurchaseNumber,
                op.supplier_name AS SupplierName,
                op.purchase_date AS PurchaseDate,

                ps.id AS Status,

                COALESCE(SUM(opi.agreed_quantity_kg), 0) AS TotalQuantityKg,

                COALESCE(SUM(opi.total_amount), 0) AS TotalAmount,

                COUNT(opi.id) AS ItemsCount

            FROM olive_purchases op

            INNER JOIN purchase_status ps
                ON ps.id = op.status_id

            LEFT JOIN olive_purchase_items opi
                ON opi.purchase_id = op.id

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ========================================================
        // Purchase Number
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
        // Supplier
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.SupplierName))
        {
            sql.Append(
                """

                AND op.supplier_name ILIKE @SupplierName
                """);

            parameters.Add(
                "SupplierName",
                $"%{filter.SupplierName}%");
        }

        // ========================================================
        // Status
        // ========================================================

        if (filter.Status.HasValue)
        {
            sql.Append(
                """

                AND op.status_id = @Status
                """);

            parameters.Add(
                "Status",
                (int)filter.Status.Value);
        }

        // ========================================================
        // From Date
        // ========================================================

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND op.purchase_date >= @FromDate
                """);

            parameters.Add(
                "FromDate",
                filter.FromDate.Value);
        }

        // ========================================================
        // To Date
        // ========================================================

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND op.purchase_date <= @ToDate
                """);

            parameters.Add(
                "ToDate",
                filter.ToDate.Value);
        }

        // ========================================================
        // GROUP BY
        // ========================================================

        sql.Append(
            """

            GROUP BY
                op.id,
                op.purchase_number,
                op.supplier_name,
                op.purchase_date,
                ps.id

            """);

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(
            """

            ORDER BY op.purchase_date DESC, op.purchase_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OlivePurchaseForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<OlivePurchaseForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    // ============================================================
    // GET OLIVE PURCHASE BY ID - DETAILS
    // ============================================================

    public async Task<OlivePurchaseForDetailsResponse?> GetOlivePurchaseById(
        int id)
    {
        const string purchaseSql =
            """
            SELECT
                op.id AS Id,

                op.purchase_number AS PurchaseNumber,

                op.supplier_name AS SupplierName,

                op.purchase_date AS PurchaseDate,

                ps.id AS Status,

                op.notes AS Notes,

                COALESCE(
                    (
                        SELECT SUM(opi.agreed_quantity_kg)
                        FROM olive_purchase_items opi
                        WHERE opi.purchase_id = op.id
                    ),
                    0
                ) AS TotalQuantityKg,

                COALESCE(
                    (
                        SELECT SUM(opi.total_amount)
                        FROM olive_purchase_items opi
                        WHERE opi.purchase_id = op.id
                    ),
                    0
                ) AS TotalAmount

            FROM olive_purchases op

            INNER JOIN purchase_status ps
                ON ps.id = op.status_id

            WHERE op.id = @Id
            """;

        const string itemsSql =
            """
            SELECT
                opi.id AS Id,

                opi.variety_id AS VarietyId,

                ov.name AS VarietyName,

                opi.agreed_quantity_kg AS AgreedQuantityKg,

                opi.price_per_kg AS PricePerKg,

                opi.total_amount AS TotalAmount

            FROM olive_purchase_items opi

            LEFT JOIN olive_varieties ov
                ON ov.id = opi.variety_id

            WHERE opi.purchase_id = @PurchaseId

            ORDER BY opi.id
            """;

        const string samplesSql =
            """
            SELECT
                os.id AS Id,

                os.sample_number AS SampleNumber,

                os.sample_date AS SampleDate,

                ss.id AS Status

            FROM olive_samples os

            INNER JOIN sample_status ss
                ON ss.id = os.status_id

            WHERE os.purchase_id = @PurchaseId

            ORDER BY os.sample_date DESC, os.sample_number
            """;

        using var connection = _dbConnection;

        var purchase =
            await connection.QuerySingleOrDefaultAsync<OlivePurchaseForDetailsResponse>(
                purchaseSql,
                new
                {
                    Id = id
                });

        if (purchase is null)
        {
            return null;
        }

        var items =
            await connection.QueryAsync<OlivePurchaseItemResponse>(
                itemsSql,
                new
                {
                    PurchaseId = id
                });

        var samples =
            await connection.QueryAsync<OliveSampleSummaryResponse>(
                samplesSql,
                new
                {
                    PurchaseId = id
                });

        purchase.Items = items.ToList();
        purchase.Samples = samples.ToList();

        return purchase;
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<OlivePurchase?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                op.id AS Id,

                op.purchase_number AS PurchaseNumber,

                op.supplier_name AS SupplierName,

                op.purchase_date AS PurchaseDate,

                op.status_id AS StatusId,

                op.notes AS Notes,

                op.created_at AS CreatedAt,

                op.updated_at AS UpdatedAt

            FROM olive_purchases op

            WHERE op.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OlivePurchase>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<OlivePurchase>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                op.id AS Id,

                op.purchase_number AS PurchaseNumber,

                op.supplier_name AS SupplierName,

                op.purchase_date AS PurchaseDate,

                op.status_id AS StatusId,

                op.notes AS Notes,

                op.created_at AS CreatedAt,

                op.updated_at AS UpdatedAt

            FROM olive_purchases op

            ORDER BY
                op.purchase_date DESC,
                op.purchase_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OlivePurchase>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY PURCHASE NUMBER
    // ============================================================

    public async Task<OlivePurchase?> GetByPurchaseNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                op.id AS Id,

                op.purchase_number AS PurchaseNumber,

                op.supplier_name AS SupplierName,

                op.purchase_date AS PurchaseDate,

                op.status_id AS StatusId,

                op.notes AS Notes,

                op.created_at AS CreatedAt,

                op.updated_at AS UpdatedAt

            FROM olive_purchases op

            WHERE op.purchase_number = @PurchaseNumber
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OlivePurchase>(
            sql,
            new
            {
                PurchaseNumber = purchaseNumber
            });
    }

    // ============================================================
    // GET OLIVE PURCHASE ITEMS - PAGINATED
    // ============================================================

    public async Task<PagedResult<OlivePurchaseItemResponse>> GetOlivePurchaseItems(
        int purchaseId,
        OlivePurchaseItemsRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
        SELECT
            COUNT(*) OVER() AS Total,

            opi.id AS Id,

            opi.reference AS Reference,

            opi.purchase_id AS PurchaseId,

            opi.variety_id AS VarietyId,

            ov.name AS VarietyName,

            opi.description AS Description,

            opi.agreed_quantity_kg AS AgreedQuantityKg,

            opi.price_per_kg AS PricePerKg,

            opi.total_amount AS TotalAmount,

            opi.notes AS Notes

        FROM olive_purchase_items opi

        LEFT JOIN olive_varieties ov
            ON ov.id = opi.variety_id

        WHERE opi.purchase_id = @PurchaseId
        """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PurchaseId",
            purchaseId);

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);


        // ========================================================
        // PAGINATION
        // ========================================================

        sql.Append(
            """

        ORDER BY opi.id DESC

        LIMIT @PageSize
        OFFSET @Offset
        """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OlivePurchaseItemResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.TotalAmount ?? 0;

        return new PagedResult<OlivePurchaseItemResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }
}
