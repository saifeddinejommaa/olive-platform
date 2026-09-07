using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Responses;
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
        var sql = new StringBuilder($@"
        SELECT

            COUNT(*) OVER() AS Total,

            op.id AS {nameof(OlivePurchaseForListResponse.Id)},
            op.reference AS {nameof(OlivePurchaseForListResponse.Reference)},
            op.supplier_name AS {nameof(OlivePurchaseForListResponse.SupplierName)},
            op.purchase_date AS {nameof(OlivePurchaseForListResponse.PurchaseDate)},
            op.created_at AS {nameof(OlivePurchaseForListResponse.CreatedAt)},
            ps.id AS {nameof(OlivePurchaseForListResponse.Status)},
            COALESCE(SUM(opi.agreed_quantity_kg), 0) AS {nameof(OlivePurchaseForListResponse.TotalQuantityKg)},
            COALESCE(
                (
                    SELECT
                        CASE
                            WHEN BOOL_OR(oa.status = 2) THEN 2 -- InProgress
                            WHEN BOOL_OR(oa.status = 1) THEN 1 -- Planned
                            WHEN BOOL_OR(oa.status = 3) THEN 3 -- Completed
                            WHEN BOOL_OR(oa.status = 4) THEN 4 -- Cancelled
                            ELSE 0
                        END
                    FROM olive_purchase_items item
                    INNER JOIN olive_analyses oa
                        ON oa.source_id = item.id
                        AND oa.source_type = 2
                    WHERE item.purchase_id = op.id
                ),
                0
            ) AS {nameof(OlivePurchaseForListResponse.AnalyseStatus)},
            COALESCE(
                (
                    SELECT
                        CASE
                            WHEN BOOL_OR(po.status_id = 2) THEN 2 -- InProgress
                            WHEN BOOL_OR(po.status_id = 1) THEN 1 -- Planned
                            WHEN BOOL_OR(po.status_id = 3) THEN 3 -- Completed
                            WHEN BOOL_OR(po.status_id = 4) THEN 4 -- Cancelled
                            ELSE 0
                        END
                    FROM pressing_operation_inputs poi
                    INNER JOIN pressing_operations po
                        ON po.id = poi.pressing_operation_id
                    INNER JOIN olive_purchase_items item
                        ON item.id = poi.purchase_item_id
                    WHERE item.purchase_id = op.id
                ),
                0
            ) AS {nameof(OlivePurchaseForListResponse.Pressed)}
            FROM olive_purchases op
            INNER JOIN purchase_status ps
                ON ps.id = op.status_id
            LEFT JOIN olive_purchase_items opi
                ON opi.purchase_id = op.id
            WHERE 1 = 1
");

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
            sql.Append(@"

AND op.reference ILIKE @PurchaseNumber
");

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
                filter.FromDate.Value.ToDateTime(TimeOnly.MinValue));
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
                filter.ToDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ========================================================
        // To Pressing
        // ========================================================

        if (filter.ToPressing == true)
        {
            sql.Append(
                """

        AND EXISTS (
            SELECT 1
            FROM olive_purchase_items item

            WHERE item.purchase_id = op.id

            AND (
                item.agreed_quantity_kg
                -
                COALESCE(
                    (
                        SELECT SUM(poi.quantity_kg)
                        FROM pressing_operation_inputs poi

                        INNER JOIN pressing_operations po
                            ON po.id = poi.pressing_operation_id

                        INNER JOIN production_status pstatus
                            ON pstatus.id = po.status_id

                        WHERE poi.purchase_item_id = item.id
                            AND poi.status = 0
                    ),
                    0
                )
            ) > 0
        )
        """);
        }

        // ========================================================
        // GROUP BY
        // ========================================================

        sql.Append(@"

GROUP BY
    op.id,
    op.reference,
    op.supplier_name,
    op.purchase_date,
    ps.id

");

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(@"

ORDER BY op.purchase_date DESC, op.reference

LIMIT @PageSize
OFFSET @Offset
");

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

    public async Task<OlivePurchaseDetailsResponse?> GetOlivePurchaseDetails(
    int id)
    {
        const string purchaseSql = $@"
        SELECT
            op.id AS {nameof(OlivePurchaseDetailsResponse.Id)},

            op.reference AS {nameof(OlivePurchaseDetailsResponse.Reference)},

            op.supplier_name AS {nameof(OlivePurchaseDetailsResponse.SupplierName)},

            op.purchase_date AS {nameof(OlivePurchaseDetailsResponse.PurchaseDate)},

            ps.id AS {nameof(OlivePurchaseDetailsResponse.Status)},

            op.created_at AS {nameof(OlivePurchaseDetailsResponse.CreatedAt)},

            op.updated_at AS {nameof(OlivePurchaseDetailsResponse.UpdatedAt)},

            COALESCE(
                (
                    SELECT SUM(opi.agreed_quantity_kg)
                    FROM olive_purchase_items opi
                    WHERE opi.purchase_id = op.id
                ),
                0
            ) AS {nameof(OlivePurchaseDetailsResponse.TotalQuantity)},

            COALESCE(
                (
                    SELECT SUM(
                        opi.agreed_quantity_kg * opi.price_per_kg
                    )
                    FROM olive_purchase_items opi
                    WHERE opi.purchase_id = op.id
                ),
                0
            ) AS {nameof(OlivePurchaseDetailsResponse.TotalAmount)},

            op.notes AS {nameof(OlivePurchaseDetailsResponse.Notes)}

        FROM olive_purchases op

        INNER JOIN purchase_status ps
            ON ps.id = op.status_id

        WHERE op.id = @Id
        ";

        using var connection = _dbConnection;

        var purchase =
            await connection.QuerySingleOrDefaultAsync<OlivePurchaseDetailsResponse>(
                purchaseSql,
                new
                {
                    Id = id
                });

        return purchase;
    }

    // ============================================================
    // GET BY PURCHASE NUMBER
    // ============================================================

    public async Task<OlivePurchase?> GetByPurchaseNumberAsync(
        string purchaseNumber,
        CancellationToken cancellationToken = default)
    {
        const string sql = @"
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
";

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


    public async Task<List<OlivePurchaseItemDetailsResponse>> GetOlivePurchaseItems(
        int purchaseId)
    {
        var sql = $@"
        SELECT
            opi.id AS {nameof(OlivePurchaseItemDetailsResponse.Id)},
            opi.reference AS {nameof(OlivePurchaseItemDetailsResponse.Reference)},
            opi.variety_id AS {nameof(OlivePurchaseItemDetailsResponse.VarietyId)},
            opi.agreed_quantity_kg AS {nameof(OlivePurchaseItemDetailsResponse.AgreedQuantityKg)},

            (
                opi.agreed_quantity_kg -
                COALESCE(
                    (
                        SELECT SUM(poi.quantity_kg)
                        FROM pressing_operation_inputs poi
                        INNER JOIN pressing_operations po
                            ON po.id = poi.pressing_operation_id
                        INNER JOIN production_status ps
                            ON ps.id = po.status_id
                        WHERE poi.purchase_item_id = opi.id
                    ),
                    0
                )
            ) AS {nameof(OlivePurchaseItemDetailsResponse.RemainingQuantityKg)},

            opi.price_per_kg AS {nameof(OlivePurchaseItemDetailsResponse.PricePerKg)},
            opi.agreed_quantity_kg * opi.price_per_kg
                AS {nameof(OlivePurchaseItemDetailsResponse.TotalAmount)},

            (
                SELECT jsonb_build_object(
                    '{nameof(OliveAnalysisInfoResponse.Id)}', oa.id,
                    '{nameof(OliveAnalysisInfoResponse.Reference)}', oa.reference,
                    '{nameof(OliveAnalysisInfoResponse.HumidityPercentage)}', oa.humidity_percentage,
                    '{nameof(OliveAnalysisInfoResponse.WaterPercentage)}', oa.water_percentage,
                    '{nameof(OliveAnalysisInfoResponse.OilPercentage)}', oa.oil_percentage,
                    '{nameof(OliveAnalysisInfoResponse.AcidityPercentage)}', oa.acidity_percentage,
                    '{nameof(OliveAnalysisInfoResponse.AnalysisDate)}', oa.analysis_date,
                    '{nameof(OliveAnalysisInfoResponse.CreatedAt)}', oa.created_at,
                    '{nameof(OliveAnalysisInfoResponse.UpdatedAt)}', oa.updated_at,
                    '{nameof(OliveAnalysisInfoResponse.Status)}', oa.status
                )
                FROM olive_analyses oa
                WHERE oa.source_id = opi.id
                  AND oa.source_type = 2
                ORDER BY oa.id DESC
                LIMIT 1
            ) AS {nameof(OlivePurchaseItemDetailsResponse.Analysis)}

        FROM olive_purchase_items opi
        WHERE opi.purchase_id = @PurchaseId
        ORDER BY opi.id DESC;
";

        using var connection = _dbConnection;

        var items = await connection.QueryAsync<OlivePurchaseItemDetailsResponse>(
            sql,
            new { PurchaseId = purchaseId }
        );

        return items.ToList();
    }



}
