using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Repositories;
using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.Laboratory.Requests;
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

    // ============================================================
    // DETAILS
    // ============================================================

    public async Task<OliveAnalysisDetailsResponse?> GetOliveAnalysisDetails(
    int id,
    CancellationToken cancellationToken = default)
    {
        const string sql = $"""
        SELECT
            oa.id AS {nameof(OliveAnalysisDetailsResponse.Id)},

            oa.source_type AS {nameof(OliveAnalysisDetailsResponse.SourceTypeId)},

            oa.reference AS {nameof(OliveAnalysisDetailsResponse.Reference)},

            COALESCE(
                h.reference,
                op.reference
            ) AS {nameof(OliveAnalysisDetailsResponse.SourceReference)},

            oa.humidity_percentage AS {nameof(OliveAnalysisDetailsResponse.HumidityPercentage)},

            oa.water_percentage AS {nameof(OliveAnalysisDetailsResponse.WaterPercentage)},

            oa.oil_percentage AS {nameof(OliveAnalysisDetailsResponse.OilPercentage)},

            oa.acidity_percentage AS {nameof(OliveAnalysisDetailsResponse.AcidityPercentage)},

            oa.analysis_date AS {nameof(OliveAnalysisDetailsResponse.AnalysisDate)},

            oa.created_at AS {nameof(OliveAnalysisDetailsResponse.CreatedAt)},

            oa.updated_at AS {nameof(OliveAnalysisDetailsResponse.UpdatedAt)},

            h.variety_id AS {nameof(OliveAnalysisDetailsResponse.VarietyId)},

            oa.status AS {nameof(OliveAnalysisDetailsResponse.Status)}

        FROM public.olive_analyses oa

        LEFT JOIN public.harvests h
            ON oa.source_type = 1
            AND h.id = oa.source_id

        LEFT JOIN public.olive_purchases op
            ON oa.source_type = 2
            AND op.id = oa.source_id

        WHERE oa.id = @Id

        LIMIT 1;
        """;

        using var connection = _dbConnection;

        var command = new CommandDefinition(
            sql,
            new
            {
                Id = id
            },
            cancellationToken: cancellationToken);

        return await connection.QueryFirstOrDefaultAsync<OliveAnalysisDetailsResponse>(
            command);
    }


    // ============================================================
    // LIST
    // ============================================================

    public async Task<PagedResult<OliveAnalysisForListResponse>> GetOliveAnalysisList(
        OliveAnalysesRequestFilter filter,
        CancellationToken cancellationToken = default)
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
                oa.reference AS {nameof(OliveAnalysisForListResponse.Reference)},

                pl.reference AS {nameof(OliveAnalysisForListResponse.PlotReference)},

                oa.analysis_date AS {nameof(OliveAnalysisForListResponse.AnalysisDate)},

                oa.created_at AS {nameof(OliveAnalysisForListResponse.CreatedAt)},

                oa.updated_at AS {nameof(OliveAnalysisForListResponse.UpdatedAt)},

                oa.status AS {nameof(OliveAnalysisForListResponse.Status)}

            FROM public.olive_analyses oa

            LEFT JOIN public.harvests h
                ON oa.source_type = 1
                AND h.id = oa.source_id

            LEFT JOIN public.olive_purchases op
                ON oa.source_type = 2
                AND op.id = oa.source_id

            LEFT JOIN public.plots pl
                ON oa.source_type = 1
                AND h.plot_id = pl.id

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();


        // ========================================================
        // PAGINATION
        // ========================================================

        var pageSize = filter.PageSize <= 0
            ? 10
            : filter.PageSize;

        var pageNumber = filter.PageNumber <= 0
            ? 1
            : filter.PageNumber;

        var offset = (pageNumber - 1) * pageSize;

        parameters.Add("PageSize", pageSize);
        parameters.Add("Offset", offset);


        // ========================================================
        // REFERENCE
        // ========================================================

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
                $"%{filter.Reference.Trim()}%");
        }


        // ========================================================
        // PLOT REFERENCE
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.PlotReference))
        {
            sql.Append(
                """

                AND pl.reference ILIKE @PlotReference
                """);

            parameters.Add(
                "PlotReference",
                $"%{filter.PlotReference.Trim()}%");
        }


        // ========================================================
        // PURCHASE REFERENCE
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.PurchaseReference))
        {
            sql.Append(
                """

                AND op.reference ILIKE @PurchaseReference
                """);

            parameters.Add(
                "PurchaseReference",
                $"%{filter.PurchaseReference.Trim()}%");
        }


        // ========================================================
        // HARVEST REFERENCE
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.HarvestReference))
        {
            sql.Append(
                """

                AND h.reference ILIKE @HarvestReference
                """);

            parameters.Add(
                "HarvestReference",
                $"%{filter.HarvestReference.Trim()}%");
        }


        // ========================================================
        // ANALYSIS DATE
        // ========================================================

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


        // ========================================================
        // STATUS
        // ========================================================

        if (filter.Status != default)
        {
            sql.Append(
                """

                AND oa.status = @Status
                """);

            parameters.Add(
                "Status",
                filter.Status);
        }


        // ========================================================
        // ORDER + PAGINATION
        // ========================================================

        sql.Append(
            """

            ORDER BY
                oa.analysis_date DESC,
                oa.id DESC

            LIMIT @PageSize
            OFFSET @Offset
            """);


        // ========================================================
        // EXECUTION
        // ========================================================

        using var connection = _dbConnection;

        var command = new CommandDefinition(
            sql.ToString(),
            parameters,
            cancellationToken: cancellationToken);

        var result = await connection.QueryAsync<OliveAnalysisForListResponse>(
            command);

        var items = result.ToList();

        var total = items.FirstOrDefault()?.Total ?? 0;


        // ========================================================
        // RESULT
        // ========================================================

        return new PagedResult<OliveAnalysisForListResponse>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = total,
            Items = items
        };
    }
}