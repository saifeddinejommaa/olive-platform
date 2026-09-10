using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Repositories;
using OlivePlatform.Application.Features.Plots.Responses;
using OlivePlatform.Domain.Enums;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class PlotQueryRepository : IPlotQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public PlotQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<PlotDetailResponse?> GetDetailAsync(int id)
    {
         string sql = $"""
        SELECT
            p.id AS {nameof(PlotDetailResponse.Id)},
            p.reference AS {nameof(PlotDetailResponse.Reference)},
            p.name AS {nameof(PlotDetailResponse.Name)},
            p.area_hectares AS {nameof(PlotDetailResponse.AreaHectares)},
            p.number_of_trees AS {nameof(PlotDetailResponse.NumberOfTrees)},
            p.planting_year AS {nameof(PlotDetailResponse.PlantingYear)},
            p.location AS {nameof(PlotDetailResponse.Location)},
            p.notes AS {nameof(PlotDetailResponse.Notes)},
            p.created_at AS {nameof(PlotDetailResponse.CreatedAt)},

            CASE
                WHEN p.number_of_trees = 0 THEN 0
                ELSE ROUND(
                    COALESCE(SUM(h.harvested_trees), 0) * 100.0 / p.number_of_trees, 2)
            END AS {nameof(PlotDetailResponse.HarvestedTreesPercentage)},

            COALESCE(SUM(h.harvested_trees), 0) < p.number_of_trees
                AS {nameof(PlotDetailResponse.CanLaunchHarvest)},

            MAX(COALESCE(v.varieties_json, '[]'::json)::text) AS {nameof(PlotDetailResponse.Varieties)}

        FROM public.plots p
        LEFT JOIN public.harvests h ON h.plot_id = p.id
        LEFT JOIN LATERAL (
            SELECT json_agg(variety_row) AS varieties_json
            FROM (
                SELECT
                    pv.variety_id AS "{nameof(PlotVarietyDetail.VarietyId)}",
                    ov.label AS "{nameof(PlotVarietyDetail.VarietyLabel)}",
                    pv.number_of_trees AS "{nameof(PlotVarietyDetail.NumberOfTrees)}",

                    GREATEST(
                        pv.number_of_trees - COALESCE(SUM(hh.harvested_trees), 0), 0
                    ) AS "{nameof(PlotVarietyDetail.RemainingTreesToHarvest)}",

                    CASE
                        WHEN pv.number_of_trees = 0 THEN 0
                        ELSE ROUND(
                            LEAST(COALESCE(SUM(hh.harvested_trees), 0), pv.number_of_trees) * 100.0
                            / pv.number_of_trees, 2)
                    END AS "{nameof(PlotVarietyDetail.HarvestedPercentage)}",

                    CASE
            WHEN pv.number_of_trees = 0 THEN 0
            ELSE ROUND(
                LEAST(
                    COALESCE(SUM(hh.planned_trees) FILTER (
                        WHERE hh.status IN (
                            {(int)ProductionStatus.Planned},
                            {(int)ProductionStatus.InProgress}
                        )
                    ), 0),
                    pv.number_of_trees
                ) * 100.0 / pv.number_of_trees, 2)
            END AS "{nameof(PlotVarietyDetail.PlannedTreesPercentage)}"

                FROM public.plot_varieties pv
                INNER JOIN public.olive_varieties ov ON ov.id = pv.variety_id
                LEFT JOIN public.harvests hh
                    ON hh.plot_id = pv.plot_id AND hh.variety_id = pv.variety_id
                WHERE pv.plot_id = p.id
                GROUP BY pv.variety_id, ov.label, pv.number_of_trees
                ORDER BY ov.label
            ) variety_row
        ) v ON true

        WHERE p.id = @Id
        GROUP BY p.id, p.reference, p.name, p.area_hectares, p.number_of_trees,
                 p.planting_year, p.location, p.notes, p.created_at
        """;

        return await _dbConnection.QueryFirstOrDefaultAsync<PlotDetailResponse>(sql, new { Id = id });
    }

    public async Task<PagedResult<PlotForListResponse>> GetPagedListAsync(PlotsRequestFilter request)
    {
        var sql = new StringBuilder(
        $"""
        SELECT
            COUNT(*) OVER() AS {nameof(PlotForListResponse.Total)},

            p.id AS {nameof(PlotForListResponse.Id)},
            p.reference AS {nameof(PlotForListResponse.Reference)},
            p.name AS {nameof(PlotForListResponse.Name)},
            p.number_of_trees AS {nameof(PlotForListResponse.NumberOfTrees)},

            CASE
                WHEN p.number_of_trees = 0 THEN 0
                ELSE ROUND(
                    COALESCE(SUM(h.harvested_trees), 0) * 100.0 / p.number_of_trees, 2)
            END AS {nameof(PlotForListResponse.HarvestedTreesPercentage)},

            CASE
                WHEN p.number_of_trees = 0 THEN 0
                ELSE ROUND(
                    LEAST(
                        COALESCE(SUM(h.planned_trees) FILTER (
                            WHERE h.status IN (
                                {(int)ProductionStatus.Planned},
                                {(int)ProductionStatus.InProgress}
                            )
                        ), 0),
                        p.number_of_trees
                    ) * 100.0 / p.number_of_trees, 2)
            END AS {nameof(PlotForListResponse.PlannedTreesPercentage)},

            COALESCE(SUM(h.harvested_trees), 0) < p.number_of_trees
                AS {nameof(PlotForListResponse.CanLaunchHarvest)}

        FROM public.plots p
        LEFT JOIN public.harvests h ON h.plot_id = p.id
        GROUP BY p.id, p.reference, p.name, p.number_of_trees
        """);

        var parameters = new DynamicParameters();

        // ----------------------------------------------------
        // Pagination parameters
        // ----------------------------------------------------

        parameters.Add(
            "PageSize",
            request.PageSize);

        parameters.Add(
            "Offset",
            (request.PageNumber - 1) * request.PageSize);

        // ----------------------------------------------------
        // Code filter
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(request.Reference))
        {
            sql.Append(
                """
                
                AND p.reference ILIKE @Code
                """);

            parameters.Add(
                "Code",
                $"%{request.Reference.Trim()}%");
        }

        // ----------------------------------------------------
        // Name filter
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            sql.Append(
                """
                
                AND p.name ILIKE @Name
                """);

            parameters.Add(
                "Name",
                $"%{request.Name.Trim()}%");
        }

        // ----------------------------------------------------
        // Order + Pagination
        // ----------------------------------------------------

        sql.Append(
            """
            
            ORDER BY p.reference
            LIMIT @PageSize
            OFFSET @Offset
            """);

        // ----------------------------------------------------
        // Execute query
        // ----------------------------------------------------

        var result =
            await _dbConnection.QueryAsync<PlotForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        // ----------------------------------------------------
        // Return paginated result
        // ----------------------------------------------------

        return new PagedResult<PlotForListResponse>
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = total,
            Items = items
        };
    }
}