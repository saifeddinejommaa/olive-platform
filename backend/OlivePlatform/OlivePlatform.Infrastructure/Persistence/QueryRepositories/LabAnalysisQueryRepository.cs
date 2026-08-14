using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Laboratory.Requests;
using OlivePlatform.Application.Features.Laboratory.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class LabAnalysisQueryRepository : ILabAnalysisQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public LabAnalysisQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET LAB ANALYSES - PAGINATED
    // ============================================================

    public async Task<PagedResult<LabAnalysisForListResponse>> GetLabAnalyses(
        LabAnalysesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                la.id AS Id,
                la.analysis_number AS AnalysisNumber,

                la.sample_id AS SampleId,
                s.sample_number AS SampleNumber,

                la.analysis_date AS AnalysisDate,
                la.analyst_name AS AnalystName,
                la.general_quality AS GeneralQuality,
                la.estimated_oil_yield AS EstimatedOilYield

            FROM lab_analyses la

            INNER JOIN olive_samples s
                ON s.id = la.sample_id

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
        // Analysis Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.AnalysisNumber))
        {
            sql.Append(
                """

                AND la.analysis_number ILIKE @AnalysisNumber
                """);

            parameters.Add(
                "AnalysisNumber",
                $"%{filter.AnalysisNumber}%");
        }

        // ----------------------------------------------------
        // Sample Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.SampleNumber))
        {
            sql.Append(
                """

                AND s.sample_number ILIKE @SampleNumber
                """);

            parameters.Add(
                "SampleNumber",
                $"%{filter.SampleNumber}%");
        }

        // ----------------------------------------------------
        // Analyst
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.AnalystName))
        {
            sql.Append(
                """

                AND la.analyst_name ILIKE @AnalystName
                """);

            parameters.Add(
                "AnalystName",
                $"%{filter.AnalystName}%");
        }

        // ----------------------------------------------------
        // General Quality
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.GeneralQuality))
        {
            sql.Append(
                """

                AND la.general_quality ILIKE @GeneralQuality
                """);

            parameters.Add(
                "GeneralQuality",
                $"%{filter.GeneralQuality}%");
        }

        // ----------------------------------------------------
        // Analysis Date From
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND la.analysis_date >= @AnalysisDateFrom
                """);

            parameters.Add(
                "AnalysisDateFrom",
                filter.FromDate.Value);
        }

        // ----------------------------------------------------
        // Analysis Date To
        // ----------------------------------------------------

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND la.analysis_date <= @AnalysisDateTo
                """);

            parameters.Add(
                "AnalysisDateTo",
                filter.ToDate.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

            ORDER BY la.analysis_date DESC, la.analysis_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<LabAnalysisForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<LabAnalysisForListResponse>
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

    public async Task<LabAnalysis?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                la.id AS Id,
                la.analysis_number AS AnalysisNumber,

                la.sample_id AS SampleId,

                la.analysis_date AS AnalysisDate,
                la.analyst_name AS AnalystName,
                la.general_quality AS GeneralQuality,
                la.estimated_oil_yield AS EstimatedOilYield,

                la.notes AS Notes,

                la.created_at AS CreatedAt,
                la.updated_at AS UpdatedAt

            FROM lab_analyses la

            WHERE la.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<LabAnalysis>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<LabAnalysis>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                la.id AS Id,
                la.analysis_number AS AnalysisNumber,

                la.sample_id AS SampleId,

                la.analysis_date AS AnalysisDate,
                la.analyst_name AS AnalystName,
                la.general_quality AS GeneralQuality,
                la.estimated_oil_yield AS EstimatedOilYield,

                la.notes AS Notes,

                la.created_at AS CreatedAt,
                la.updated_at AS UpdatedAt

            FROM lab_analyses la

            ORDER BY la.analysis_date DESC, la.analysis_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<LabAnalysis>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY SAMPLE ID
    // ============================================================

    public async Task<LabAnalysis?> GetBySampleIdAsync(
        int sampleId,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                la.id AS Id,
                la.analysis_number AS AnalysisNumber,

                la.sample_id AS SampleId,

                la.analysis_date AS AnalysisDate,
                la.analyst_name AS AnalystName,
                la.general_quality AS GeneralQuality,
                la.estimated_oil_yield AS EstimatedOilYield,

                la.notes AS Notes,

                la.created_at AS CreatedAt,
                la.updated_at AS UpdatedAt

            FROM lab_analyses la

            WHERE la.sample_id = @SampleId

            ORDER BY la.analysis_date DESC
            """;

        using var connection = _dbConnection;

        return await connection.QueryFirstOrDefaultAsync<LabAnalysis>(
            sql,
            new
            {
                SampleId = sampleId
            });
    }
}