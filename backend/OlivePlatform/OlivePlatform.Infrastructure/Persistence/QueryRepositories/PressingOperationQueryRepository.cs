using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Responses;
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
        SELECT
            COUNT(*) OVER() AS {nameof(PressingOperationForListResponse.Total)},

            p.id AS {nameof(PressingOperationForListResponse.Id)},
            p.season_id AS {nameof(PressingOperationForListResponse.SeasonId)},
            p.operation_number AS {nameof(PressingOperationForListResponse.OperationNumber)},
            p.status_id AS {nameof(PressingOperationForListResponse.Status)},

            p.planned_date AS {nameof(PressingOperationForListResponse.PlannedDate)},

            COALESCE(
                SUM(poi.quantity_kg),
                0
            ) AS {nameof(PressingOperationForListResponse.OliveQuantityKg)},

            p.oil_quantity_liters AS {nameof(PressingOperationForListResponse.OilQuantityLiters)},

            CASE
                WHEN COALESCE(SUM(poi.quantity_kg), 0) > 0
                     AND p.oil_quantity_liters IS NOT NULL
                THEN
                    (p.oil_quantity_liters / SUM(poi.quantity_kg)) * 100
                ELSE NULL
            END AS {nameof(PressingOperationForListResponse.YieldPercentage)},

            p.start_time AS {nameof(PressingOperationForListResponse.StartTime)},
            p.end_time AS {nameof(PressingOperationForListResponse.EndTime)},

            MAX(poi.status) AS {nameof(PressingOperationForListResponse.OliveAnalysis)}

        FROM pressing_operations p

        LEFT JOIN pressing_operation_inputs poi
            ON poi.pressing_operation_id = p.id

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

        // EXISTS : filtrer les entrées dans la jointure fausserait
        // la quantité d'olives agrégée de l'opération.
        if (!string.IsNullOrWhiteSpace(filter.HarvestNumber))
        {
            sql.Append(
                """

            AND EXISTS (
                SELECT 1
                FROM pressing_operation_inputs fpoi
                INNER JOIN olive_lots fpl ON fpl.id = fpoi.lot_id
                INNER JOIN harvests fh ON fh.id = fpl.harvest_id
                WHERE fpoi.pressing_operation_id = p.id
                  AND fh.reference ILIKE @HarvestNumber
            )
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

            AND EXISTS (
                SELECT 1
                FROM pressing_operation_inputs fpoi
                INNER JOIN olive_lots fpl ON fpl.id = fpoi.lot_id
                INNER JOIN olive_purchases fop ON fop.id = fpl.purchase_id
                WHERE fpoi.pressing_operation_id = p.id
                  AND fop.reference ILIKE @PurchaseNumber
            )
            """);

            parameters.Add(
                "PurchaseNumber",
                $"%{filter.PurchaseNumber}%");
        }

        // ========================================================
        // DU : début de la pression (start_time)
        // ========================================================

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

            AND p.start_time::date >= @FromDate
            """);

            parameters.Add(
                "FromDate",
                filter.FromDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ========================================================
        // AU : fin de la pression (end_time)
        // ========================================================

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

            AND p.end_time::date <= @ToDate
            """);

            parameters.Add(
                "ToDate",
                filter.ToDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ----------------------------------------------------
        // Season
        // ----------------------------------------------------

        if (filter.SeasonId.HasValue)
        {
            sql.Append(
                """

                AND p.season_id = @SeasonId
                """);

            parameters.Add(
                "SeasonId",
                filter.SeasonId.Value);
        }
        // ========================================================
        // GROUP BY
        // ========================================================

        sql.Append(
            """
        
        GROUP BY
            p.id,
            p.season_id,
            p.operation_number,
            p.status_id,
            p.planned_date,
            p.oil_quantity_liters,
            p.start_time,
            p.end_time
        """);

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
            po.season_id {nameof(PressingOperationDetailsResponse.SeasonId)},
            po.operation_number {nameof(PressingOperationDetailsResponse.OperationNumber)},
            po.status_id {nameof(PressingOperationDetailsResponse.Status)},
            po.created_at {nameof(PressingOperationDetailsResponse.CreatedAt)},
            po.oil_quantity_liters {nameof(PressingOperationDetailsResponse.OilQuantityLiters)},
            po.planned_date {nameof(PressingOperationDetailsResponse.PlannedDate)},
            po.start_time {nameof(PressingOperationDetailsResponse.StartTime)},
            po.end_time {nameof(PressingOperationDetailsResponse.EndTime)},
            po.expected_oil_liters {nameof(PressingOperationDetailsResponse.ExpectedOilLiters)},
            po.oil_yield_deviation_liters {nameof(PressingOperationDetailsResponse.OilYieldDeviationLiters)},

            COALESCE(
                SUM(poi.quantity_kg),
                0
            ) AS {nameof(PressingOperationDetailsResponse.OliveQuantityKg)},

            (
            SELECT json_build_object(
                'id', pp.id,
                'processTypeId', pp.process_type_id,
                'malaxingTemperatureC', pp.malaxing_temperature_c,
                'malaxingDurationMinutes', pp.malaxing_duration_minutes,
                'malaxingSpeedRpm', pp.malaxing_speed_rpm,
                'feedRateKgH', pp.feed_rate_kg_h,
                'decanterSpeedRpm', pp.decanter_speed_rpm,
                'decanterDifferentialRpm', pp.decanter_differential_rpm,
                'centrifugeSpeedRpm', pp.centrifuge_speed_rpm,
                'addedWaterLiters', pp.added_water_liters,
                'waterTemperatureC', pp.water_temperature_c,
                'waitingTimeBeforeExtractionMinutes', pp.waiting_time_before_extraction_minutes,
                'notes', pp.notes
            )
            FROM pressing_parameters pp
            WHERE pp.pressing_operation_id = po.id
        ) AS {nameof(PressingOperationDetailsResponse.Parameters)}

        FROM pressing_operations po

        LEFT JOIN pressing_operation_inputs poi
            ON poi.pressing_operation_id = po.id

        WHERE po.id = @Id

        GROUP BY
            po.id,
            po.season_id,
            po.operation_number,
            po.status_id,
            po.created_at,
            po.oil_quantity_liters,
            po.planned_date,
            po.start_time,
            po.end_time;
        """;

        using var connection = _dbConnection;

        var result = await connection.QuerySingleOrDefaultAsync<PressingOperationDetailsResponse>(
            sql,
            new { Id = id });

        return result;
    }

    public async Task<List<PressingOperationInputDetailsResponse>> GetPressingOperationInputs(
    int operationId,
    CancellationToken cancellationToken = default)
    {
        var sql = $"""
        SELECT
            poi.id AS {nameof(PressingOperationInputDetailsResponse.Id)},
            pl.id AS {nameof(PressingOperationInputDetailsResponse.LotId)},
            pl.reference AS {nameof(PressingOperationInputDetailsResponse.LotReference)},
            pl.source_type_id AS {nameof(PressingOperationInputDetailsResponse.SourceType)},
            COALESCE(pl.harvest_id, pl.purchase_id) AS {nameof(PressingOperationInputDetailsResponse.SourceId)},
            COALESCE(h.reference, op.reference) AS {nameof(PressingOperationInputDetailsResponse.SourceReference)},
            pl.quantity_kg AS {nameof(PressingOperationInputDetailsResponse.QuantityKg)},
            pl.remaining_kg AS {nameof(PressingOperationInputDetailsResponse.RemainingKg)},
            poi.quantity_kg AS {nameof(PressingOperationInputDetailsResponse.PressedQuantityKg)},
            COALESCE(pl.variety_id, h.variety_id) AS {nameof(PressingOperationInputDetailsResponse.OliveVarietyId)},

            CASE
                WHEN oa.id IS NULL THEN NULL
                ELSE json_build_object(

                    '{nameof(OliveAnalysisInfoResponse.Id)}',
                        oa.id,

                    '{nameof(OliveAnalysisInfoResponse.Reference)}',
                        oa.reference,

                    '{nameof(OliveAnalysisInfoResponse.HumidityPercentage)}',
                        oa.humidity_percentage,

                    '{nameof(OliveAnalysisInfoResponse.WaterPercentage)}',
                        oa.water_percentage,

                    '{nameof(OliveAnalysisInfoResponse.OilPercentage)}',
                        oa.oil_percentage,

                    '{nameof(OliveAnalysisInfoResponse.AcidityPercentage)}',
                        oa.acidity_percentage,

                    '{nameof(OliveAnalysisInfoResponse.PlannedDate)}',
                        oa.planned_date,

                    '{nameof(OliveAnalysisInfoResponse.UpdatedAt)}',
                        oa.updated_at,

                    '{nameof(OliveAnalysisInfoResponse.Status)}',
                        oa.status
                )
            END AS {nameof(PressingOperationInputDetailsResponse.Analysis)}

        FROM pressing_operation_inputs poi

        INNER JOIN olive_lots pl
            ON pl.id = poi.lot_id

        LEFT JOIN harvests h
            ON h.id = pl.harvest_id

        LEFT JOIN olive_purchases op
            ON op.id = pl.purchase_id

        LEFT JOIN olive_analyses oa
            ON oa.id = pl.olive_analysis_id

        WHERE poi.pressing_operation_id = @PressingOperationId

        ORDER BY poi.id;
        """;

        using var connection = _dbConnection;

        var inputs = await connection.QueryAsync<PressingOperationInputDetailsResponse>(
            sql,
            new
            {
                PressingOperationId = operationId
            });

        return inputs.ToList();
    }
}