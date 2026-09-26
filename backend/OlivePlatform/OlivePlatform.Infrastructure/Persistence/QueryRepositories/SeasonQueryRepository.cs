using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons.Repositories;
using OlivePlatform.Application.Features.Seasons.Requests;
using OlivePlatform.Application.Features.Seasons.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.Persistence.QueryRepositories;

public class SeasonQueryRepository : ISeasonQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public SeasonQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    private const string DetailsColumns = $"""
            s.id AS {nameof(SeasonDetailsResponse.Id)},
            s.label AS {nameof(SeasonDetailsResponse.Label)},
            s.start_date AS {nameof(SeasonDetailsResponse.StartDate)},
            s.end_date AS {nameof(SeasonDetailsResponse.EndDate)},
            s.status AS {nameof(SeasonDetailsResponse.Status)},
            (CURRENT_DATE BETWEEN s.start_date AND s.end_date) AS {nameof(SeasonDetailsResponse.IsCurrent)},
            s.notes AS {nameof(SeasonDetailsResponse.Notes)},
            s.closed_at AS {nameof(SeasonDetailsResponse.ClosedAt)},
            s.created_at AS {nameof(SeasonDetailsResponse.CreatedAt)},
            s.updated_at AS {nameof(SeasonDetailsResponse.UpdatedAt)}
        """;

    // ============================================================
    // GET SEASONS - PAGINATED
    // ============================================================

    public async Task<PagedResult<SeasonForListResponse>> GetSeasons(
        SeasonsRequestFilter filter,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(
            $"""
            SELECT
                COUNT(*) OVER() AS {nameof(SeasonForListResponse.Total)},

                s.id AS {nameof(SeasonForListResponse.Id)},
                s.label AS {nameof(SeasonForListResponse.Label)},
                s.start_date AS {nameof(SeasonForListResponse.StartDate)},
                s.end_date AS {nameof(SeasonForListResponse.EndDate)},
                s.status AS {nameof(SeasonForListResponse.Status)},
                (CURRENT_DATE BETWEEN s.start_date AND s.end_date) AS {nameof(SeasonForListResponse.IsCurrent)}

            FROM seasons s

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
        // Label
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Label))
        {
            sql.Append(
                """

                AND s.label ILIKE @Label
                """);

            parameters.Add(
                "Label",
                $"%{filter.Label}%");
        }

        // ----------------------------------------------------
        // Status
        // ----------------------------------------------------

        if (filter.Status.HasValue)
        {
            sql.Append(
                """

                AND s.status = @Status
                """);

            parameters.Add(
                "Status",
                (int)filter.Status.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """

            ORDER BY s.start_date DESC

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<SeasonForListResponse>(
                new CommandDefinition(
                    sql.ToString(),
                    parameters,
                    cancellationToken: cancellationToken));

        var items = result.ToList();

        return new PagedResult<SeasonForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = items.FirstOrDefault()?.Total ?? 0,
            Items = items
        };
    }

    // ============================================================
    // GET SEASON DETAILS
    // ============================================================

    public async Task<SeasonDetailsResponse?> GetSeasonDetails(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT
            {DetailsColumns}
            FROM seasons s
            WHERE s.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<SeasonDetailsResponse>(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id
                },
                cancellationToken: cancellationToken));
    }

    // ============================================================
    // GET CURRENT SEASON
    // ============================================================

    public async Task<SeasonDetailsResponse?> GetCurrentSeason(
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT
            {DetailsColumns}
            FROM seasons s
            WHERE CURRENT_DATE BETWEEN s.start_date AND s.end_date
            LIMIT 1
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<SeasonDetailsResponse>(
            new CommandDefinition(
                sql,
                cancellationToken: cancellationToken));
    }
}
