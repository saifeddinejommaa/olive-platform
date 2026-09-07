using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Harvests.Responses;
using OlivePlatform.Domain.Entities;
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
                h.reference AS {nameof(HarvestForListResponse.Reference)},
                p.name AS {nameof(HarvestForListResponse.PlotName)},
                h.harvest_date AS {nameof(HarvestForListResponse.HarvestDate)},
                h.quantity_kg AS {nameof(HarvestForListResponse.QuantityKg)},
                h.planned_trees AS {nameof(HarvestForListResponse.PlannedTrees)},
                h.harvested_trees AS {nameof(HarvestForListResponse.HarvestedTrees)},
                h.variety_id AS {nameof(HarvestForListResponse.VarietyId)},
                h.notes AS {nameof(HarvestForListResponse.Notes)},
                h.status AS {nameof(HarvestForListResponse.Status)},
                h.start_time AS {nameof(HarvestForListResponse.StartTime)},
                h.end_time AS {nameof(HarvestForListResponse.EndTime)},
                h.created_at AS {nameof(HarvestForListResponse.CreatedAt)},
                h.updated_at AS {nameof(HarvestForListResponse.UpdatedAt)}

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
        // Harvest Date From
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND h.harvest_date >= @HarvestDateFrom
                """);

            parameters.Add(
                "HarvestDateFrom",
                filter.FromDate.Value);
        }

        // ----------------------------------------------------
        // Harvest Date To
        // ----------------------------------------------------

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND h.harvest_date <= @HarvestDateTo
                """);

            parameters.Add(
                "HarvestDateTo",
                filter.ToDate.Value);
        }

        // ========================================================
        // To Pressing
        // ========================================================

        if (filter.ToPressing == true)
        {
            sql.Append(
                """
        
        AND h.status = 3

        AND (
            h.quantity_kg
            - COALESCE(
                (
                    SELECT SUM(poi.quantity_kg)
                    FROM pressing_operation_inputs poi
                    INNER JOIN pressing_operations po
                        ON po.id = poi.pressing_operation_id
                    WHERE poi.harvest_id = h.id
                      AND poi.status = 0
                ),
                0
            )
        ) > 0
        """);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

            ORDER BY
                h.harvest_date DESC,
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
        const string sql =
            $"""
        SELECT
            h.id {nameof(HarvestDetailsResponse.Id)},
            h.reference {nameof(HarvestDetailsResponse.Reference)},
            p.reference {nameof(HarvestDetailsResponse.PlotReference)},
            h.harvest_date {nameof(HarvestDetailsResponse.HarvestDate)},
            h.quantity_kg  {nameof(HarvestDetailsResponse.QuantityKg)},
            h.planned_trees {nameof(HarvestDetailsResponse.PlannedTrees)},
            h.harvested_trees {nameof(HarvestDetailsResponse.HarvestedTrees)},
            h.notes {nameof(HarvestDetailsResponse.Notes)},
            h.status {nameof(HarvestDetailsResponse.Status)},
            h.start_time {nameof(HarvestDetailsResponse.StartTime)},
            h.end_time {nameof(HarvestDetailsResponse.EndTime)},
            h.created_at {nameof(HarvestDetailsResponse.CreatedAt)},
            h.updated_at {nameof(HarvestDetailsResponse.UpdatedAt)},
            h.variety_id {nameof(HarvestDetailsResponse.VarietyId)},

            COALESCE(
                json_agg(
                    json_build_object(
                        '{nameof(HarvestStockForListResponse.Id)}',
                            hs.id,

                        '{nameof(HarvestStockForListResponse.HarvestId)}',
                            hs.harvest_id,

                        '{nameof(HarvestStockForListResponse.Reference)}',
                            hs.reference,

                        '{nameof(HarvestStockForListResponse.QuantityKg)}',
                            hs.quantity_kg,

                        '{nameof(HarvestStockForListResponse.Status)}',
                            hs.status,

                        '{nameof(HarvestStockForListResponse.CreatedAt)}',
                            hs.created_at,

                        '{nameof(HarvestStockForListResponse.UpdatedAt)}',
                            hs.updated_at
                    )
                    ORDER BY hs.created_at DESC
                ) FILTER (WHERE hs.id IS NOT NULL),
                '[]'::json
            ) AS {nameof(HarvestDetailsResponse.Stocks)}

        FROM public.harvests h

        INNER JOIN public.plots p
            ON p.id = h.plot_id

        LEFT JOIN public.harvest_stock hs
            ON hs.harvest_id = h.id

        WHERE h.id = @Id

        GROUP BY
            h.id,
            h.reference,
            p.reference,
            h.harvest_date,
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

                h.harvest_date AS HarvestDate,
                h.quantity_kg AS QuantityKg,
                h.quality_grade AS QualityGrade,
                h.notes AS Notes

            FROM harvests h

            WHERE h.plot_id = @PlotId

            ORDER BY
                h.harvest_date DESC,
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

    public async Task<PagedResult<HarvestStockForListResponse>> GetHarvestStocks(int id, HarvestStocksRequestFilter filter, CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(
           $"""
            SELECT
                COUNT(*) OVER() AS {nameof(HarvestStockForListResponse.Total)},

                id {nameof(HarvestStockForListResponse.Id)} ,
                harvest_id {nameof(HarvestStockForListResponse.HarvestId)},
                reference {nameof(HarvestStockForListResponse.HarvestId)},
                quantity_kg {nameof(HarvestStockForListResponse.HarvestId)},
                status {nameof(HarvestStockForListResponse.Status)},
                created_at {nameof(HarvestStockForListResponse.CreatedAt)},
                updated_at {nameof(HarvestStockForListResponse.UpdatedAt)}
            FROM public.harvest_stock
            WHERE harvest_id = @HarvestId
            ORDER BY created_at DESC
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "HarvestId",
            id);

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

            ORDER BY
                h.harvest_date DESC,
                h.reference

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<HarvestStockForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<HarvestStockForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };

    }
}