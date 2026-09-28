using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class HarvestQueryRepository : IHarvestQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public HarvestQueryRepository(
        IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET HARVESTS - PAGINATED
    // ============================================================

    public async Task<PagedResult<HarvestForListResponse>> GetHarvests(
        HarvestsRequestFilter filter)
    {
        var sql = new StringBuilder(
            $"""
            SELECT
                COUNT(*) OVER() {nameof(HarvestForListResponse.Total)},

                h.id AS {nameof(HarvestForListResponse.Id)},
                h.season_id AS {nameof(HarvestForListResponse.SeasonId)},
                h.reference AS {nameof(HarvestForListResponse.Reference)},
                p.name AS {nameof(HarvestForListResponse.PlotName)},
                h.planned_date AS {nameof(HarvestForListResponse.PlannedDate)},
                h.quantity_kg AS {nameof(HarvestForListResponse.QuantityKg)},
                h.planned_trees AS {nameof(HarvestForListResponse.PlannedTrees)},
                h.harvested_trees AS {nameof(HarvestForListResponse.HarvestedTrees)},
                h.variety_id AS {nameof(HarvestForListResponse.VarietyId)},
                h.notes AS {nameof(HarvestForListResponse.Notes)},
                h.status AS {nameof(HarvestForListResponse.Status)},
                h.start_time AS {nameof(HarvestForListResponse.StartTime)},
                h.end_time AS {nameof(HarvestForListResponse.EndTime)},
                h.created_at AS {nameof(HarvestForListResponse.CreatedAt)},
                h.updated_at AS {nameof(HarvestForListResponse.UpdatedAt)},
                (
                    SELECT po.status_id
                    FROM pressing_operation_inputs poi
                    INNER JOIN pressing_operations po
                        ON po.id = poi.pressing_operation_id
                    INNER JOIN olive_lots lot
                        ON lot.id = poi.lot_id
                    WHERE lot.harvest_id = h.id
                    ORDER BY po.created_at DESC
                    LIMIT 1
                ) AS {nameof(HarvestForListResponse.Pressing)},
                (
                    SELECT oa.status
                    FROM olive_analyses oa
                    WHERE oa.id IN (
                        SELECT lot.olive_analysis_id
                        FROM olive_lots lot
                        WHERE lot.harvest_id = h.id
                    )
                    ORDER BY oa.created_at DESC
                    LIMIT 1
                ) AS {nameof(HarvestForListResponse.Analysis)},

                EXISTS (
                    SELECT 1
                    FROM olive_lots pl
                    WHERE pl.harvest_id = h.id
                      AND {OliveLotSql.SelectableCondition}
                )
                AND h.status = {(int)ProductionStatus.Completed} AS {nameof(HarvestForListResponse.CanBePressed)}

            FROM harvests h
            INNER JOIN plots p ON p.id = h.plot_id

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
        // Harvest Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(
            filter.HarvestNumber))
        {
            sql.Append(
                """

                AND h.reference ILIKE @HarvestNumber
                """);

            parameters.Add(
                "HarvestNumber",
                $"%{filter.HarvestNumber}%");
        }

        // ----------------------------------------------------
        // Season
        // ----------------------------------------------------

        if (filter.SeasonId.HasValue)
        {
            sql.Append(
                """

                AND h.season_id = @SeasonId
                """);

            parameters.Add(
                "SeasonId",
                filter.SeasonId.Value);
        }
        // ----------------------------------------------------
        // Plot
        // ----------------------------------------------------

        if (filter.PlotId.HasValue)
        {
            sql.Append(
                """

                AND h.plot_id = @PlotId
                """);

            parameters.Add(
                "PlotId",
                filter.PlotId.Value);
        }

        // ----------------------------------------------------
        // Plot Reference
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.PlotReference))
        {
            sql.Append(
                """

                AND p.reference ILIKE @PlotReference
                """);

            parameters.Add(
                "PlotReference",
                $"%{filter.PlotReference.Trim()}%");
        }

        // ----------------------------------------------------
        // Status
        // ----------------------------------------------------

        if (filter.Status.HasValue)
        {
            sql.Append(
                """

                AND h.status = @Status
                """);

            parameters.Add(
                "Status",
                (int)filter.Status.Value);
        }

        // ----------------------------------------------------
        // Du : début de la récolte (start_time)
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND h.start_time::date >= @HarvestDateFrom
                """);

            parameters.Add(
                "HarvestDateFrom",
                filter.FromDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ----------------------------------------------------
        // Au : fin de la récolte (end_time)
        // ----------------------------------------------------

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND h.end_time::date <= @HarvestDateTo
                """);

            parameters.Add(
                "HarvestDateTo",
                filter.ToDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ========================================================
        // To Pressing
        // ========================================================

        if (filter.ToPressing == true)
        {
            sql.Append($"""

                AND h.status = 3
                AND EXISTS (
                    SELECT 1
                    FROM olive_lots pl
                    WHERE pl.harvest_id = h.id
                      AND {OliveLotSql.SelectableCondition}
                )
                """);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

            ORDER BY
                h.planned_date DESC,
                h.reference

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<HarvestForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<HarvestForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    public async Task<HarvestDetailsResponse?> GetHarvestDetails(
    int id,
     CancellationToken cancellationToken = default)
    {
        const string sql = $"""
        SELECT
            h.id AS "{nameof(HarvestDetailsResponse.Id)}",
            h.season_id AS "{nameof(HarvestDetailsResponse.SeasonId)}",
            h.reference AS "{nameof(HarvestDetailsResponse.Reference)}",
            p.reference AS "{nameof(HarvestDetailsResponse.PlotReference)}",
            h.planned_date AS "{nameof(HarvestDetailsResponse.PlannedDate)}",
            h.quantity_kg AS "{nameof(HarvestDetailsResponse.QuantityKg)}",
            h.variety_id AS "{nameof(HarvestDetailsResponse.VarietyId)}",
            h.planned_trees AS "{nameof(HarvestDetailsResponse.PlannedTrees)}",
            COALESCE(h.harvested_trees, 0) AS "{nameof(HarvestDetailsResponse.HarvestedTrees)}",
            h.notes AS "{nameof(HarvestDetailsResponse.Notes)}",
            h.status AS "{nameof(HarvestDetailsResponse.Status)}",
            (
                h.status = 3 -- Terminée
                AND EXISTS (
                    SELECT 1
                    FROM olive_lots pl
                    WHERE pl.harvest_id = h.id
                      AND {OliveLotSql.SelectableCondition}
                )
            ) AS "{nameof(HarvestDetailsResponse.CanBePressed)}",
            h.start_time AS "{nameof(HarvestDetailsResponse.StartTime)}",
            h.harvest_type_id AS "{nameof(HarvestDetailsResponse.HarvestType)}",
            h.end_time AS "{nameof(HarvestDetailsResponse.EndTime)}",
            h.created_at AS "{nameof(HarvestDetailsResponse.CreatedAt)}",
            h.updated_at AS "{nameof(HarvestDetailsResponse.UpdatedAt)}",

            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            '{nameof(HarvestCostSummaryResponse.CostLineTypeId)}',
                            c.type_id,

                            '{nameof(HarvestCostSummaryResponse.TotalAmount)}',
                            c.total_amount
                        )
                        ORDER BY c.type_id
                    )
                    FROM (
                        SELECT
                            clt.id AS type_id,
                            clt.label,

                            COALESCE(
                                SUM(hcl.total_amount),
                                0
                            ) AS total_amount,

                            COALESCE(
                                SUM(
                                    CASE
                                        WHEN hcl.is_paid = TRUE
                                        THEN hcl.total_amount
                                        ELSE 0
                                    END
                                ),
                                0
                            ) AS paid_amount,

                            COALESCE(
                                SUM(
                                    CASE
                                        WHEN hcl.is_paid = FALSE
                                        THEN hcl.total_amount
                                        ELSE 0
                                    END
                                ),
                                0
                            ) AS unpaid_amount

                        FROM public.harvest_cost_line hcl

                        INNER JOIN public.cost_line_type clt
                            ON clt.id = hcl.type_id

                        WHERE hcl.harvest_id = h.id

                        GROUP BY
                            clt.id,
                            clt.label
                    ) c
                ),
                '[]'::json
            ) AS "{nameof(HarvestDetailsResponse.Costs)}"

        FROM public.harvests h

        INNER JOIN public.plots p
            ON p.id = h.plot_id

        WHERE h.id = @Id

        GROUP BY
            h.id,
            h.season_id,
            h.variety_id,
            h.planned_trees,
            h.harvested_trees,
            h.reference,
            p.reference,
            h.planned_date,
            h.quantity_kg,
            h.notes,
            h.status,
            h.start_time,
            h.end_time,
            h.created_at,
            h.updated_at;
        """;

        using var connection = _dbConnection;

        var result =
            await connection.QuerySingleOrDefaultAsync<HarvestDetailsResponse>(
                new CommandDefinition(
                    sql,
                    new
                    {
                        Id = id
                    },
                    cancellationToken: cancellationToken));

        if (result is null)
            return null;

        return result;
    }



    // ============================================================
    // GET BY PLOT ID
    // ============================================================

    public async Task<IReadOnlyList<Harvest>> GetByPlotIdAsync(
        int plotId,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                h.id AS Id,
                h.harvest_number AS HarvestNumber,

                h.plot_id AS PlotId,

                h.planned_date AS PlannedDate,
                h.quantity_kg AS QuantityKg,
                h.quality_grade AS QualityGrade,
                h.notes AS Notes

            FROM harvests h

            WHERE h.plot_id = @PlotId

            ORDER BY
                h.planned_date DESC,
                h.harvest_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Harvest>(
                sql,
                new
                {
                    PlotId = plotId
                });

        return result.ToList();
    }

    public async Task<OliveAnalysisDetailsResponse?> GetAnalysisDetails(int id, CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT
                oa.id AS {nameof(OliveAnalysisDetailsResponse.Id)},
                oa.season_id AS {nameof(OliveAnalysisDetailsResponse.SeasonId)},
                oa.reference AS {nameof(OliveAnalysisDetailsResponse.Reference)},
                1 AS {nameof(OliveAnalysisDetailsResponse.SourceTypeId)},
                oa.humidity_percentage AS {nameof(OliveAnalysisDetailsResponse.HumidityPercentage)},
                oa.water_percentage AS {nameof(OliveAnalysisDetailsResponse.WaterPercentage)},
                oa.oil_percentage AS {nameof(OliveAnalysisDetailsResponse.OilPercentage)},
                oa.acidity_percentage AS {nameof(OliveAnalysisDetailsResponse.AcidityPercentage)},
                oa.planned_date AS {nameof(OliveAnalysisDetailsResponse.PlannedDate)},
                oa.start_time AS {nameof(OliveAnalysisDetailsResponse.StartTime)},
                oa.end_time AS {nameof(OliveAnalysisDetailsResponse.EndTime)},
                oa.status AS {nameof(OliveAnalysisDetailsResponse.Status)}
            FROM olive_analyses oa
            WHERE oa.id IN (
                SELECT lot.olive_analysis_id
                FROM olive_lots lot
                WHERE lot.harvest_id = @HarvestId
            )
            ORDER BY oa.created_at DESC
            LIMIT 1;
            """;

        using var connection = _dbConnection;

        var command = new CommandDefinition(
            sql,
            new
            {
                HarvestId = id
            },
            cancellationToken: cancellationToken);

        return await connection.QueryFirstOrDefaultAsync<OliveAnalysisDetailsResponse>(
            command);
    }

    // ============================================================
    // SEARCH WORKERS (from cost lines)
    // ============================================================

    public async Task<IReadOnlyList<WorkerSuggestionResponse>> SearchWorkers(
        string? search,
        int limit,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(
            $"""
            SELECT
                btrim(hcl.worker_name) AS {nameof(WorkerSuggestionResponse.WorkerName)},
                NULLIF(btrim(hcl.worker_identifier), '') AS {nameof(WorkerSuggestionResponse.WorkerIdentifier)}

            FROM harvest_cost_line hcl

            WHERE hcl.worker_name IS NOT NULL
              AND btrim(hcl.worker_name) <> ''
            """);

        var parameters = new DynamicParameters();

        parameters.Add("Limit", limit);

        if (!string.IsNullOrWhiteSpace(search))
        {
            sql.Append(
                """

                AND (
                    hcl.worker_name ILIKE @Search
                    OR hcl.worker_identifier ILIKE @Search
                )
                """);

            parameters.Add("Search", $"%{search.Trim()}%");
        }

        sql.Append(
            """

            GROUP BY
                btrim(hcl.worker_name),
                NULLIF(btrim(hcl.worker_identifier), '')

            ORDER BY
                MAX(hcl.date) DESC,
                1

            LIMIT @Limit
            """);

        using var connection = _dbConnection;

        var result = await connection.QueryAsync<WorkerSuggestionResponse>(
            new CommandDefinition(
                sql.ToString(),
                parameters,
                cancellationToken: cancellationToken));

        return result.ToList();
    }
}