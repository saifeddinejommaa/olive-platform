using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilMovements.Requests;
using OlivePlatform.Application.Features.OilMovements.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OilMovementQueryRepository : IOilMovementQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public OilMovementQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET OIL MOVEMENTS - PAGINATED
    // ============================================================

    public async Task<PagedResult<OilMovementForListResponse>> GetOilMovements(
        OilMovementsRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                om.id AS Id,
                om.movement_number AS MovementNumber,

                omt.id AS MovementType,

                om.movement_date AS MovementDate,

                om.oil_batch_id AS OilBatchId,
                ob.batch_number AS OilBatchNumber,

                om.source_tank_id AS SourceTankId,
                st.code AS SourceTankCode,

                om.destination_tank_id AS DestinationTankId,
                dt.code AS DestinationTankCode,

                om.quantity_liters AS QuantityLiters,

                om.reference_type AS ReferenceType,
                om.reference_id AS ReferenceId,

                om.notes AS Notes

            FROM oil_movements om

            INNER JOIN oil_movement_type omt
                ON omt.id = om.movement_type_id

            LEFT JOIN oil_batches ob
                ON ob.id = om.oil_batch_id

            LEFT JOIN tanks st
                ON st.id = om.source_tank_id

            LEFT JOIN tanks dt
                ON dt.id = om.destination_tank_id

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
        // Movement Number
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.MovementNumber))
        {
            sql.Append(
                """

                AND om.movement_number ILIKE @MovementNumber
                """);

            parameters.Add(
                "MovementNumber",
                $"%{filter.MovementNumber}%");
        }

        // ========================================================
        // Movement Type
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.MovementType))
        {
            sql.Append(
                """

                AND omt.code = @MovementType
                """);

            parameters.Add(
                "MovementType",
                filter.MovementType);
        }

        // ========================================================
        // Oil Batch
        // ========================================================

        if (filter.OilBatchId.HasValue)
        {
            sql.Append(
                """

                AND om.oil_batch_id = @OilBatchId
                """);

            parameters.Add(
                "OilBatchId",
                filter.OilBatchId.Value);
        }

        // ========================================================
        // Source Tank
        // ========================================================

        if (filter.SourceTankId.HasValue)
        {
            sql.Append(
                """

                AND om.source_tank_id = @SourceTankId
                """);

            parameters.Add(
                "SourceTankId",
                filter.SourceTankId.Value);
        }

        // ========================================================
        // Destination Tank
        // ========================================================

        if (filter.DestinationTankId.HasValue)
        {
            sql.Append(
                """

                AND om.destination_tank_id = @DestinationTankId
                """);

            parameters.Add(
                "DestinationTankId",
                filter.DestinationTankId.Value);
        }

        // ========================================================
        // Date From
        // ========================================================

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND om.movement_date >= @FromDate
                """);

            parameters.Add(
                "FromDate",
                filter.FromDate.Value);
        }

        // ========================================================
        // Date To
        // ========================================================

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND om.movement_date <= @ToDate
                """);

            parameters.Add(
                "ToDate",
                filter.ToDate.Value);
        }

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(
            """

            ORDER BY om.movement_date DESC, om.movement_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OilMovementForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<OilMovementForListResponse>
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

    public async Task<OilMovement?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                om.id AS Id,
                om.movement_number AS MovementNumber,

                om.movement_type_id AS MovementTypeId,

                om.movement_date AS MovementDate,

                om.oil_batch_id AS OilBatchId,

                om.source_tank_id AS SourceTankId,

                om.destination_tank_id AS DestinationTankId,

                om.quantity_liters AS QuantityLiters,

                om.reference_type AS ReferenceType,
                om.reference_id AS ReferenceId,

                om.notes AS Notes,

                om.created_at AS CreatedAt

            FROM oil_movements om

            WHERE om.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OilMovement>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET BY TANK ID
    // ============================================================

    public async Task<IReadOnlyList<OilMovement>> GetByTankIdAsync(
        int tankId,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                om.id AS Id,
                om.movement_number AS MovementNumber,

                om.movement_type_id AS MovementTypeId,

                om.movement_date AS MovementDate,

                om.oil_batch_id AS OilBatchId,

                om.source_tank_id AS SourceTankId,

                om.destination_tank_id AS DestinationTankId,

                om.quantity_liters AS QuantityLiters,

                om.reference_type AS ReferenceType,
                om.reference_id AS ReferenceId,

                om.notes AS Notes,

                om.created_at AS CreatedAt

            FROM oil_movements om

            WHERE om.source_tank_id = @TankId
               OR om.destination_tank_id = @TankId

            ORDER BY om.movement_date DESC, om.movement_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OilMovement>(
                sql,
                new
                {
                    TankId = tankId
                });

        return result.ToList();
    }

    // ============================================================
    // GET BY OIL BATCH ID
    // ============================================================

    public async Task<IReadOnlyList<OilMovement>> GetByOilBatchIdAsync(
        int oilBatchId,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                om.id AS Id,
                om.movement_number AS MovementNumber,

                om.movement_type_id AS MovementTypeId,

                om.movement_date AS MovementDate,

                om.oil_batch_id AS OilBatchId,

                om.source_tank_id AS SourceTankId,

                om.destination_tank_id AS DestinationTankId,

                om.quantity_liters AS QuantityLiters,

                om.reference_type AS ReferenceType,
                om.reference_id AS ReferenceId,

                om.notes AS Notes,

                om.created_at AS CreatedAt

            FROM oil_movements om

            WHERE om.oil_batch_id = @OilBatchId

            ORDER BY om.movement_date DESC, om.movement_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<OilMovement>(
                sql,
                new
                {
                    OilBatchId = oilBatchId
                });

        return result.ToList();
    }
}