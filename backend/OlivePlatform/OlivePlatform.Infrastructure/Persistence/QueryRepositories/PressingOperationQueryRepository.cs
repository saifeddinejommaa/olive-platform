using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Production.Responses;
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
            $"""
        SELECT DISTINCT
            COUNT(*) OVER() {nameof(PressingOperationDetailsResponse.Total)},

            p.id {nameof(PressingOperationDetailsResponse.Id)},
            p.operation_number {nameof(PressingOperationDetailsResponse.OperationNumber)},
            p.start_time  {nameof(PressingOperationDetailsResponse.StartTime)},
            p.created_at  {nameof(PressingOperationDetailsResponse.CreatedAt)},
            p.end_time {nameof(PressingOperationDetailsResponse.EndTime)},
            p.status_id {nameof(PressingOperationDetailsResponse.Status)},
            p.oil_quantity_liters {nameof(PressingOperationDetailsResponse.OilQuantityLiters)}

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
            
            AND h.reference ILIKE @HarvestNumber
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
    // GET PRESSING OPERATION DETAILS
    // ============================================================

    public async Task<PressingOperationDetailsResponse> GetPressingOperationDetails(int id, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
        SELECT
            po.id {nameof(PressingOperationDetailsResponse.Id)},
            po.operation_number {nameof(PressingOperationDetailsResponse.OperationNumber)},
            po.status_id {nameof(PressingOperationDetailsResponse.Status)},
            po.created_at {nameof(PressingOperationDetailsResponse.CreatedAt)},
            po.oil_quantity_liters {nameof(PressingOperationDetailsResponse.OilQuantityLiters)},
            po.start_time {nameof(PressingOperationDetailsResponse.StartTime)},
            po.end_time {nameof(PressingOperationDetailsResponse.EndTime)},

            COALESCE(
                SUM(poi.quantity_kg),
                0
            ) AS {nameof(PressingOperationDetailsResponse.OliveQuantityKg)},

            COALESCE(
                json_agg(
                    json_build_object(
                        '{nameof(PressingOperationInputResponse.Id)}', poi.id,

                        '{nameof(PressingOperationInputResponse.SourceType)}',
                            CASE
                                WHEN poi.harvest_id IS NOT NULL THEN 1
                                WHEN poi.purchase_item_id IS NOT NULL THEN 2
                            END,

                        '{nameof(PressingOperationInputResponse.SourceId)}',
                            CASE
                                WHEN poi.harvest_id IS NOT NULL
                                    THEN poi.harvest_id
                                WHEN poi.purchase_item_id IS NOT NULL
                                    THEN poi.purchase_item_id
                            END,

                        '{nameof(PressingOperationInputResponse.SourceReference)}',
                            CASE
                                WHEN poi.harvest_id IS NOT NULL
                                    THEN h.reference
                                WHEN poi.purchase_item_id IS NOT NULL
                                    THEN opi.reference
                            END,

                        '{nameof(PressingOperationInputResponse.QuantityKg)}',
                            CASE
                                WHEN poi.harvest_id IS NOT NULL
                                    THEN h.quantity_kg
                                WHEN poi.purchase_item_id IS NOT NULL
                                    THEN opi.agreed_quantity_kg
                            END,

                        '{nameof(PressingOperationInputResponse.PressedQuantityKg)}',
                            poi.quantity_kg,

                        '{nameof(PressingOperationInputResponse.OliveVarietyId)}',
                            CASE
                                WHEN poi.harvest_id IS NOT NULL
                                    THEN h.variety_id
                                WHEN poi.purchase_item_id IS NOT NULL
                                    THEN opi.variety_id
                            END
                    )
                    ORDER BY poi.id
                ) FILTER (WHERE poi.id IS NOT NULL),
                '[]'::json
            ) AS {nameof(PressingOperationDetailsResponse.Inputs)}

        FROM pressing_operations po

        LEFT JOIN pressing_operation_inputs poi
            ON poi.pressing_operation_id = po.id

        LEFT JOIN harvests h
            ON h.id = poi.harvest_id

        LEFT JOIN olive_purchase_items opi
            ON opi.id = poi.purchase_item_id

        WHERE po.id = @Id

        GROUP BY
            po.id,
            po.operation_number,
            po.status_id,
            po.created_at,
            po.oil_quantity_liters,
            po.start_time,
            po.end_time;
        """;

        using var connection = _dbConnection;

        var result = await connection.QuerySingleOrDefaultAsync<PressingOperationDetailsResponse>(
            sql,
            new { Id = id });

        return result;
    }
}