using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilMovements.Requests;
using OlivePlatform.Application.Features.OilMovements.Responses;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OilMovementQueryRepository : IOilMovementQueryRepository
{
    private readonly IDbConnection _dbConnection;

    // Mouvement avec son type, son lot, sa pression d'origine et ses citernes.
    private const string MovementSelect = $"""
        SELECT
            COUNT(*) OVER() AS {nameof(OilMovementForListResponse.Total)},

            om.id AS {nameof(OilMovementForListResponse.Id)},
            om.movement_number AS {nameof(OilMovementForListResponse.MovementNumber)},
            om.movement_type_id AS {nameof(OilMovementForListResponse.MovementType)},
            omt.label AS {nameof(OilMovementForListResponse.MovementTypeLabel)},
            om.movement_date AS {nameof(OilMovementForListResponse.MovementDate)},

            om.oil_batch_id AS {nameof(OilMovementForListResponse.OilBatchId)},
            ob.batch_number AS {nameof(OilMovementForListResponse.OilBatchNumber)},
            po.id AS {nameof(OilMovementForListResponse.PressingOperationId)},
            po.operation_number AS {nameof(OilMovementForListResponse.PressingNumber)},

            om.source_tank_id AS {nameof(OilMovementForListResponse.SourceTankId)},
            st.reference AS {nameof(OilMovementForListResponse.SourceTankCode)},
            st.name AS {nameof(OilMovementForListResponse.SourceTankName)},

            om.destination_tank_id AS {nameof(OilMovementForListResponse.DestinationTankId)},
            dt.reference AS {nameof(OilMovementForListResponse.DestinationTankCode)},
            dt.name AS {nameof(OilMovementForListResponse.DestinationTankName)},

            om.quantity_liters AS {nameof(OilMovementForListResponse.QuantityLiters)},
            om.notes AS {nameof(OilMovementForListResponse.Notes)}

        FROM oil_movements om

        INNER JOIN oil_movement_type omt
            ON omt.id = om.movement_type_id

        LEFT JOIN oil_batches ob
            ON ob.id = om.oil_batch_id

        LEFT JOIN pressing_operations po
            ON po.id = ob.production_batch_id

        LEFT JOIN tanks st
            ON st.id = om.source_tank_id

        LEFT JOIN tanks dt
            ON dt.id = om.destination_tank_id
        """;

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
        var sql = new StringBuilder(MovementSelect);

        sql.Append("""

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.PageNumber - 1) * filter.PageSize);

        // N° de mouvement, lot d'huile ou pression.
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            sql.Append("""

                AND (
                    om.movement_number ILIKE @Search
                    OR ob.batch_number ILIKE @Search
                    OR po.operation_number ILIKE @Search
                )
                """);

            parameters.Add("Search", $"%{filter.Search.Trim()}%");
        }

        if (filter.MovementType.HasValue)
        {
            sql.Append("""

                AND om.movement_type_id = @MovementType
                """);

            parameters.Add("MovementType", (int)filter.MovementType.Value);
        }

        // Citerne d'origine ou de destination.
        if (filter.TankId.HasValue)
        {
            sql.Append("""

                AND (om.source_tank_id = @TankId OR om.destination_tank_id = @TankId)
                """);

            parameters.Add("TankId", filter.TankId.Value);
        }

        if (filter.FromDate.HasValue)
        {
            sql.Append("""

                AND om.movement_date::date >= @FromDate
                """);

            parameters.Add("FromDate", filter.FromDate.Value.Date);
        }

        if (filter.ToDate.HasValue)
        {
            sql.Append("""

                AND om.movement_date::date <= @ToDate
                """);

            parameters.Add("ToDate", filter.ToDate.Value.Date);
        }

        sql.Append("""

            ORDER BY om.movement_date DESC, om.id DESC

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var items = (await connection.QueryAsync<OilMovementForListResponse>(
            sql.ToString(),
            parameters)).ToList();

        return new PagedResult<OilMovementForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = items.FirstOrDefault()?.Total ?? 0,
            Items = items
        };
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<OilMovementForListResponse?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            {MovementSelect}
            WHERE om.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OilMovementForListResponse>(
            sql,
            new { Id = id });
    }
}
