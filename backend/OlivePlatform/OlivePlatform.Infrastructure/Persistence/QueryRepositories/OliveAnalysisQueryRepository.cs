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

                 oa.season_id AS {nameof(OliveAnalysisDetailsResponse.SeasonId)},

                 opi.source_type_id AS {nameof(OliveAnalysisDetailsResponse.SourceTypeId)},

                 oa.reference AS {nameof(OliveAnalysisDetailsResponse.Reference)},

                 CASE
                     WHEN opi.source_type_id = 1 THEN h.reference
                     WHEN opi.source_type_id = 2 THEN opi.reference
                 END AS {nameof(OliveAnalysisDetailsResponse.SourceReference)},

                 oa.humidity_percentage AS {nameof(OliveAnalysisDetailsResponse.HumidityPercentage)},

                 oa.water_percentage AS {nameof(OliveAnalysisDetailsResponse.WaterPercentage)},

                 oa.oil_percentage AS {nameof(OliveAnalysisDetailsResponse.OilPercentage)},

                 oa.acidity_percentage AS {nameof(OliveAnalysisDetailsResponse.AcidityPercentage)},

                 oa.planned_date AS {nameof(OliveAnalysisDetailsResponse.PlannedDate)},

                 oa.start_time AS {nameof(OliveAnalysisDetailsResponse.StartTime)},

                 oa.end_time AS {nameof(OliveAnalysisDetailsResponse.EndTime)},

                 CASE
                     WHEN opi.source_type_id = 1 THEN h.variety_id
                     WHEN opi.source_type_id = 2 THEN opi.variety_id
                 END AS {nameof(OliveAnalysisDetailsResponse.VarietyId)},

                 (
                     SELECT COALESCE(SUM(l.quantity_kg), 0)
                     FROM public.olive_lots l
                     WHERE l.olive_analysis_id = oa.id
                 ) AS {nameof(OliveAnalysisDetailsResponse.QuantityKg)},

                 (
                     SELECT COUNT(*)
                     FROM public.olive_lots l
                     WHERE l.olive_analysis_id = oa.id
                 )::int AS {nameof(OliveAnalysisDetailsResponse.LotsCount)},

                 oa.status AS {nameof(OliveAnalysisDetailsResponse.Status)}

             FROM public.olive_analyses oa

             -- Lot rattaché à l'analyse (récolte : lots partagés ; achat : un lot)
             LEFT JOIN LATERAL (
                 SELECT l.*
                 FROM public.olive_lots l
                 WHERE l.olive_analysis_id = oa.id
                 ORDER BY l.id
                 LIMIT 1
             ) opi ON TRUE

             -- Source = Harvest
             LEFT JOIN public.harvests h
                 ON h.id = opi.harvest_id

             -- Parent Olive Purchase
             LEFT JOIN public.olive_purchases op
                 ON op.id = opi.purchase_id

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

             oa.season_id AS {nameof(OliveAnalysisForListResponse.SeasonId)},

             CASE
                 WHEN opi.source_type_id = 1 THEN h.reference
                 WHEN opi.source_type_id = 2 THEN opi.reference
             END AS {nameof(OliveAnalysisForListResponse.SourceReference)},

             oa.reference AS {nameof(OliveAnalysisForListResponse.Reference)},

             pl.reference AS {nameof(OliveAnalysisForListResponse.PlotReference)},

             opi.source_type_id AS {nameof(OliveAnalysisForListResponse.SourceTypeId)},

             oa.humidity_percentage AS {nameof(OliveAnalysisForListResponse.HumidityPercentage)},

             oa.water_percentage AS {nameof(OliveAnalysisForListResponse.WaterPercentage)},

             oa.oil_percentage AS {nameof(OliveAnalysisForListResponse.OilPercentage)},

             oa.acidity_percentage AS {nameof(OliveAnalysisForListResponse.AcidityPercentage)},

             oa.planned_date AS {nameof(OliveAnalysisForListResponse.PlannedDate)},

             oa.start_time AS {nameof(OliveAnalysisForListResponse.StartTime)},

             oa.end_time AS {nameof(OliveAnalysisForListResponse.EndTime)},

             oa.status AS {nameof(OliveAnalysisForListResponse.Status)}

         FROM public.olive_analyses oa

         -- Lot rattaché à l'analyse (récolte : lots partagés ; achat : un lot)
         LEFT JOIN LATERAL (
             SELECT l.*
             FROM public.olive_lots l
             WHERE l.olive_analysis_id = oa.id
             ORDER BY l.id
             LIMIT 1
         ) opi ON TRUE

         -- Source = Harvest
         LEFT JOIN public.harvests h
             ON h.id = opi.harvest_id

         -- Parent Olive Purchase
         LEFT JOIN public.olive_purchases op
             ON op.id = opi.purchase_id

         -- Plot uniquement pour les récoltes
         LEFT JOIN public.plots pl
             ON h.plot_id = pl.id

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

                AND oa.reference ILIKE @Reference
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
        // DU : début de l'analyse (start_time)
        // ========================================================

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND oa.start_time::date >= @FromDate
                """);

            parameters.Add(
                "FromDate",
                filter.FromDate.Value.ToDateTime(TimeOnly.MinValue));
        }

        // ========================================================
        // AU : fin de l'analyse (end_time)
        // ========================================================

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND oa.end_time::date <= @ToDate
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

                AND oa.season_id = @SeasonId
                """);

            parameters.Add(
                "SeasonId",
                filter.SeasonId.Value);
        }
        // ========================================================
        // STATUS
        // ========================================================

        if (filter.Status.HasValue)
        {
            sql.Append(
                """

                AND oa.status = @Status
                """);

            parameters.Add(
                "Status",
                (int)filter.Status.Value);
        }


        // ========================================================
        // ORDER + PAGINATION
        // ========================================================

        sql.Append(
            """

            ORDER BY
                oa.planned_date DESC,
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