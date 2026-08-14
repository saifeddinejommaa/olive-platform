using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Workers.Requests;
using OlivePlatform.Application.Features.Workers.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class WorkerQueryRepository : IWorkerQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public WorkerQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET WORKERS - PAGINATED
    // ============================================================

    public async Task<PagedResult<WorkerForListResponse>> GetWorkers(
        WorkersRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                w.id AS Id,
                w.code AS Code,
                w.name AS Name,
                w.phone AS Phone,
                w.worker_type AS WorkerType,
                w.daily_rate AS DailyRate,
                w.is_active AS IsActive,

                COUNT(ws.id) AS WorkSessionsCount

            FROM workers w

            LEFT JOIN work_sessions ws
                ON ws.worker_id = w.id

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ========================================================
        // Code
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.Code))
        {
            sql.Append(
                """

                AND w.code ILIKE @Code
                """);

            parameters.Add(
                "Code",
                $"%{filter.Code}%");
        }

        // ========================================================
        // Name
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            sql.Append(
                """

                AND w.name ILIKE @Name
                """);

            parameters.Add(
                "Name",
                $"%{filter.Name}%");
        }

        // ========================================================
        // Worker Type
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.WorkerType))
        {
            sql.Append(
                """

                AND w.worker_type ILIKE @WorkerType
                """);

            parameters.Add(
                "WorkerType",
                $"%{filter.WorkerType}%");
        }

        // ========================================================
        // Is Active
        // ========================================================

        if (filter.IsActive.HasValue)
        {
            sql.Append(
                """

                AND w.is_active = @IsActive
                """);

            parameters.Add(
                "IsActive",
                filter.IsActive.Value);
        }

        // ========================================================
        // GROUP BY
        // ========================================================

        sql.Append(
            """

            GROUP BY
                w.id,
                w.code,
                w.name,
                w.phone,
                w.worker_type,
                w.daily_rate,
                w.is_active

            """);

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(
            """

            ORDER BY
                w.code

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<WorkerForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<WorkerForListResponse>
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

    public async Task<Worker?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                w.id AS Id,

                w.code AS Code,

                w.name AS Name,

                w.phone AS Phone,

                w.worker_type AS WorkerType,

                w.daily_rate AS DailyRate,

                w.is_active AS IsActive,

                w.notes AS Notes,

                w.created_at AS CreatedAt,

                w.updated_at AS UpdatedAt

            FROM workers w

            WHERE w.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Worker>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Worker>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                w.id AS Id,

                w.code AS Code,

                w.name AS Name,

                w.phone AS Phone,

                w.worker_type AS WorkerType,

                w.daily_rate AS DailyRate,

                w.is_active AS IsActive,

                w.notes AS Notes,

                w.created_at AS CreatedAt,

                w.updated_at AS UpdatedAt

            FROM workers w

            ORDER BY
                w.code
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Worker>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY CODE
    // ============================================================

    public async Task<Worker?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                w.id AS Id,

                w.code AS Code,

                w.name AS Name,

                w.phone AS Phone,

                w.worker_type AS WorkerType,

                w.daily_rate AS DailyRate,

                w.is_active AS IsActive,

                w.notes AS Notes,

                w.created_at AS CreatedAt,

                w.updated_at AS UpdatedAt

            FROM workers w

            WHERE w.code = @Code
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Worker>(
            sql,
            new
            {
                Code = code
            });
    }
}