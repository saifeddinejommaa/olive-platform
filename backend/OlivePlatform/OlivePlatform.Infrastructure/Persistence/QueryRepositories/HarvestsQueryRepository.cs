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

        AND EXISTS (
            SELECT 1
            FROM olive_purchase_items item

            WHERE item.purchase_id = h.id

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

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<Harvest?> GetByIdAsync(
        int id,
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

            WHERE h.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Harvest>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Harvest>> GetAllAsync(
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

            ORDER BY
                h.harvest_date DESC,
                h.harvest_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Harvest>(sql);

        return result.ToList();
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
}