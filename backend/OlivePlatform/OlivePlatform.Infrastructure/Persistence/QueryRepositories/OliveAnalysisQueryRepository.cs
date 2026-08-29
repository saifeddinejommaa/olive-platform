using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Repositories;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Application.Features.Laboratory.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OliveAnalysisQueryRepository : IOliveAnalysisQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public OliveAnalysisQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public Task<OliveAnalysisDetailsResponse> GetOliveAnalysisDetails(HarvestsRequestFilter filter)
    {
        throw new NotImplementedException();
    }

    public async Task<PagedResult<OliveAnalysisForListResponse>> GetOliveAnalysisList(
     OliveAnalysesRequestFilter filter,
     CancellationToken cancellationToken)
    {
        var sql = new StringBuilder(
            $"""
        SELECT
            COUNT(*) OVER() AS {nameof(OliveAnalysisForListResponse.Total)},
            oa.id AS {nameof(OliveAnalysisForListResponse.Id)},

            COALESCE(
                h.reference,
                op.reference
            ) AS {nameof(OliveAnalysisForListResponse.SourceReference)},

            pl.reference AS {nameof(OliveAnalysisForListResponse.PlotReference)},

            oa.analysis_date AS {nameof(OliveAnalysisForListResponse.AnalysisDate)},
            oa.created_at AS {nameof(OliveAnalysisForListResponse.CreatedAt)},
            oa.updated_at AS {nameof(OliveAnalysisForListResponse.UpdatedAt)}

        FROM olive_analyses oa

        LEFT JOIN harvests h
            ON oa.source_type = 1
            AND h.id = oa.source_id

        LEFT JOIN olive_purchases op
            ON oa.source_type = 2
            AND op.id = oa.source_id

        LEFT JOIN plots pl
            ON oa.source_type = 1
            AND h.plot_id = pl.id

        WHERE 1 = 1
        """);

        var parameters = new DynamicParameters();

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ----------------------------------------------------
        // Reference
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Reference))
        {
            sql.Append(
                """

            AND (
                h.reference ILIKE @Reference
                OR op.reference ILIKE @Reference
            )
            """);

            parameters.Add(
                "Reference",
                $"%{filter.Reference}%");
        }

        // ----------------------------------------------------
        // Plot Reference
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.PlotReference))
        {
            sql.Append(
                """

            AND pl.reference ILIKE @PlotReference
            """);

            parameters.Add(
                "PlotReference",
                $"%{filter.PlotReference}%");
        }

        // ----------------------------------------------------
        // Purchase Reference
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.PurchaseReference))
        {
            sql.Append(
                """

            AND op.reference ILIKE @PurchaseReference
            """);

            parameters.Add(
                "PurchaseReference",
                $"%{filter.PurchaseReference}%");
        }

        // ----------------------------------------------------
        // Harvest Reference
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.HarvestReference))
        {
            sql.Append(
                """

            AND h.reference ILIKE @HarvestReference
            """);

            parameters.Add(
                "HarvestReference",
                $"%{filter.HarvestReference}%");
        }

        // ----------------------------------------------------
        // Analysis Date
        // ----------------------------------------------------

        if (filter.AnalysisDate.HasValue)
        {
            sql.Append(
                """

            AND oa.analysis_date::date = @AnalysisDate
            """);

            parameters.Add(
                "AnalysisDate",
                filter.AnalysisDate.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

        ORDER BY oa.analysis_date DESC, oa.id DESC

        LIMIT @PageSize
        OFFSET @Offset
        """);

        using var connection = _dbConnection;

        var result = await connection.QueryAsync<OliveAnalysisForListResponse>(
            sql.ToString(),
            parameters);

        var items = result.ToList();

        var total = items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<OliveAnalysisForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }
}