using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Tanks.Requests;
using OlivePlatform.Application.Features.Tanks.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class TankQueryRepository : ITankQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public TankQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET TANKS - PAGINATED
    // ============================================================

    public async Task<PagedResult<TankForListResponse>> GetTanks(
        TanksRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                t.id AS Id,
                t.code AS Code,
                t.name AS Name,
                t.capacity_liters AS CapacityLiters,
                t.location AS Location,
                t.tank_type AS TankType,
                t.status AS Status

            FROM tanks t

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

                AND t.code ILIKE @Code
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

                AND t.name ILIKE @Name
                """);

            parameters.Add(
                "Name",
                $"%{filter.Name}%");
        }

        // ========================================================
        // Location
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.Location))
        {
            sql.Append(
                """

                AND t.location ILIKE @Location
                """);

            parameters.Add(
                "Location",
                $"%{filter.Location}%");
        }

        // ========================================================
        // Tank Type
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.TankType))
        {
            sql.Append(
                """

                AND t.tank_type ILIKE @TankType
                """);

            parameters.Add(
                "TankType",
                $"%{filter.TankType}%");
        }

        // ========================================================
        // Status
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.Status))
        {
            sql.Append(
                """

                AND t.status = @Status
                """);

            parameters.Add(
                "Status",
                filter.Status);
        }

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(
            """

            ORDER BY
                t.code

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<TankForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<TankForListResponse>
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

    public async Task<Tank?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                t.id AS Id,

                t.code AS Code,

                t.name AS Name,

                t.capacity_liters AS CapacityLiters,

                t.location AS Location,

                t.tank_type AS TankType,

                t.status AS Status,

                t.notes AS Notes,

                t.created_at AS CreatedAt,

                t.updated_at AS UpdatedAt

            FROM tanks t

            WHERE t.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Tank>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Tank>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                t.id AS Id,

                t.code AS Code,

                t.name AS Name,

                t.capacity_liters AS CapacityLiters,

                t.location AS Location,

                t.tank_type AS TankType,

                t.status AS Status,

                t.notes AS Notes,

                t.created_at AS CreatedAt,

                t.updated_at AS UpdatedAt

            FROM tanks t

            ORDER BY
                t.code
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Tank>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY CODE
    // ============================================================

    public async Task<Tank?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                t.id AS Id,

                t.code AS Code,

                t.name AS Name,

                t.capacity_liters AS CapacityLiters,

                t.location AS Location,

                t.tank_type AS TankType,

                t.status AS Status,

                t.notes AS Notes,

                t.created_at AS CreatedAt,

                t.updated_at AS UpdatedAt

            FROM tanks t

            WHERE t.code = @Code
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Tank>(
            sql,
            new
            {
                Code = code
            });
    }
}