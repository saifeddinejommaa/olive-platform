using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Plots.Repositories;
using OlivePlatform.Application.Features.Plots.Responses;
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

    public async Task<PagedResult<PlotForListResponse>> GetPlots(
        PlotsRequestFilter filter)
    {
        var sql = new StringBuilder(
            $"""
            SELECT
                COUNT(*) OVER() AS {nameof(PlotForListResponse.Total)},

                p.id AS {nameof(PlotForListResponse.Id)},
                p.reference AS {nameof(PlotForListResponse.Reference)},
                p.name AS {nameof(PlotForListResponse.Name)},
                p.area_hectares AS {nameof(PlotForListResponse.AreaHectares)},
                p.number_of_trees AS {nameof(PlotForListResponse.NumberOfTrees)},
                p.planting_year AS {nameof(PlotForListResponse.PlantingYear)},
                p.location AS {nameof(PlotForListResponse.Location)}

            FROM public.plots p

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        // ----------------------------------------------------
        // Pagination parameters
        // ----------------------------------------------------

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ----------------------------------------------------
        // Code filter
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Reference))
        {
            sql.Append(
                """
                
                AND p.reference ILIKE @Code
                """);

            parameters.Add(
                "Code",
                $"%{filter.Reference.Trim()}%");
        }

        // ----------------------------------------------------
        // Name filter
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            sql.Append(
                """
                
                AND p.name ILIKE @Name
                """);

            parameters.Add(
                "Name",
                $"%{filter.Name.Trim()}%");
        }

        // ----------------------------------------------------
        // IsActive filter
        // ----------------------------------------------------

        if (filter.IsActive.HasValue)
        {
            sql.Append(
                """
                
                AND p.is_active = @IsActive
                """);

            parameters.Add(
                "IsActive",
                filter.IsActive.Value);
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
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    public async Task<PlotForDetailsResponse?> GetPlotById(
        int id)
    {
        const string sql =
            """
            SELECT
                p.id AS "Id",
                p.code AS "Code",
                p.name AS "Name",
                p.area_hectares AS "AreaHectares",
                p.number_of_trees AS "NumberOfTrees",
                p.planting_year AS "PlantingYear",
                p.location AS "Location",
                p.notes AS "Notes",
                p.is_active AS "IsActive",
                p.created_at AS "CreatedAt",
                p.updated_at AS "UpdatedAt"

            FROM public.plots p

            WHERE p.id = @Id
            """;

        return await _dbConnection.QuerySingleOrDefaultAsync<PlotForDetailsResponse>(
            sql,
            new
            {
                Id = id
            });
    }
}