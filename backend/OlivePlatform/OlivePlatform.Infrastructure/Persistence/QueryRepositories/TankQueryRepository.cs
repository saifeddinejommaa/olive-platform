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

    // Colonnes d'une citerne, mappées sur l'entité Tank (le code est la colonne reference).
    private const string TankColumns = """
        t.id AS Id,
        t.reference AS Code,
        t.name AS Name,
        t.capacity_liters AS CapacityLiters,
        t.tank_type_id AS TankType,
        t.oil_category_id AS OilCategory,
        t.status AS Status,
        t.notes AS Notes,
        t.updated_at AS UpdatedAt
        """;

    // Citerne avec son type, sa catégorie et son contenu actuel (entrées moins sorties).
    private const string TankSummarySelect = $"""
        SELECT
            COUNT(*) OVER() AS {nameof(TankForListResponse.Total)},

            t.id AS {nameof(TankForListResponse.Id)},
            t.reference AS {nameof(TankForListResponse.Code)},
            t.name AS {nameof(TankForListResponse.Name)},
            t.capacity_liters AS {nameof(TankForListResponse.CapacityLiters)},
            t.tank_type_id AS {nameof(TankForListResponse.TankType)},
            tt.label AS {nameof(TankForListResponse.TankTypeLabel)},
            t.oil_category_id AS {nameof(TankForListResponse.OilCategory)},
            oc.label AS {nameof(TankForListResponse.OilCategoryLabel)},
            t.status AS {nameof(TankForListResponse.Status)},
            t.notes AS {nameof(TankDetailsResponse.Notes)},
            level.quantity AS {nameof(TankForListResponse.CurrentQuantityLiters)},
            t.capacity_liters - level.quantity AS {nameof(TankForListResponse.AvailableCapacityLiters)},
            ROUND(level.quantity * 100 / t.capacity_liters, 1) AS {nameof(TankForListResponse.FillPercentage)},
            pending.operation_number AS {nameof(TankForListResponse.PendingPressingNumber)},
            pending_analysis.id AS {nameof(TankForListResponse.PendingOilAnalysisId)},
            pending_analysis.status AS {nameof(TankForListResponse.PendingOilAnalysisStatus)},
            pending_analysis.oil_category_id AS {nameof(TankForListResponse.PendingOilCategory)},
            pending_analysis.category_label AS {nameof(TankForListResponse.PendingOilCategoryLabel)}

        FROM tanks t
        INNER JOIN tank_type tt
            ON tt.id = t.tank_type_id
        INNER JOIN oil_category oc
            ON oc.id = t.oil_category_id

        -- Contenu actuel : entrées moins sorties.
        CROSS JOIN LATERAL (
            SELECT COALESCE(SUM(
                CASE WHEN m.destination_tank_id = t.id THEN m.quantity_liters ELSE -m.quantity_liters END
            ), 0) AS quantity
            FROM oil_movements m
            WHERE m.destination_tank_id = t.id
               OR m.source_tank_id = t.id
        ) level

        -- Tampon occupée : la dernière pression versée dedans.
        LEFT JOIN LATERAL (
            SELECT po.id AS pressing_operation_id, po.operation_number
            FROM oil_movements m
            INNER JOIN oil_batches b
                ON b.id = m.oil_batch_id
            INNER JOIN pressing_operations po
                ON po.id = b.production_batch_id
            WHERE m.destination_tank_id = t.id
              AND t.tank_type_id = 1
              AND level.quantity > 0
            ORDER BY m.movement_date DESC
            LIMIT 1
        ) pending ON TRUE

        -- Analyse d'huile de cette pression (la plus récente) : l'huile est-elle déjà analysée ?
        LEFT JOIN LATERAL (
            SELECT a.id, a.status, a.oil_category_id, ac.label AS category_label
            FROM oil_analyses a
            LEFT JOIN oil_category ac ON ac.id = a.oil_category_id
            WHERE a.source_type_id = 1
              AND a.source_id = pending.pressing_operation_id
            ORDER BY a.id DESC
            LIMIT 1
        ) pending_analysis ON TRUE
        """;

    // Lots d'huile encore présents dans la citerne, avec l'analyse de leur pression.
    private const string TankContentsSql = $"""
        SELECT
            b.id AS {nameof(TankContentResponse.OilBatchId)},
            b.batch_number AS {nameof(TankContentResponse.BatchNumber)},
            -- date -> timestamp : Dapper ne convertit pas DateOnly en DateTime.
            b.production_date::timestamp AS {nameof(TankContentResponse.ProductionDate)},
            b.status AS {nameof(TankContentResponse.BatchStatus)},
            SUM(CASE WHEN m.destination_tank_id = @Id THEN m.quantity_liters ELSE -m.quantity_liters END)
                AS {nameof(TankContentResponse.QuantityLiters)},
            po.id AS {nameof(TankContentResponse.PressingOperationId)},
            po.operation_number AS {nameof(TankContentResponse.PressingNumber)},
            oa.id AS {nameof(TankContentResponse.OilAnalysisId)},
            oa.reference AS {nameof(TankContentResponse.OilAnalysisReference)},
            oa.status AS {nameof(TankContentResponse.OilAnalysisStatus)},
            oa.acidity_percentage AS {nameof(TankContentResponse.AcidityPercentage)},
            oa.peroxide_index AS {nameof(TankContentResponse.PeroxideIndex)},
            oa.k232 AS {nameof(TankContentResponse.K232)},
            oa.k270 AS {nameof(TankContentResponse.K270)},
            oa.oil_category_id AS {nameof(TankContentResponse.OilAnalysisCategory)},
            oa.category_label AS {nameof(TankContentResponse.OilAnalysisCategoryLabel)}

        FROM oil_movements m
        INNER JOIN oil_batches b
            ON b.id = m.oil_batch_id
        LEFT JOIN pressing_operations po
            ON po.id = b.production_batch_id
        LEFT JOIN LATERAL (
            SELECT a.id, a.reference, a.status, a.acidity_percentage, a.peroxide_index, a.k232, a.k270,
                   a.oil_category_id, ac.label AS category_label
            FROM oil_analyses a
            LEFT JOIN oil_category ac ON ac.id = a.oil_category_id
            WHERE a.source_type_id = 1
              AND a.source_id = b.production_batch_id
            ORDER BY a.id DESC
            LIMIT 1
        ) oa ON TRUE

        WHERE m.destination_tank_id = @Id
           OR m.source_tank_id = @Id

        GROUP BY
            b.id, po.id,
            oa.id, oa.reference, oa.status, oa.acidity_percentage, oa.peroxide_index, oa.k232, oa.k270,
            oa.oil_category_id, oa.category_label

        HAVING SUM(CASE WHEN m.destination_tank_id = @Id THEN m.quantity_liters ELSE -m.quantity_liters END) > 0

        ORDER BY b.production_date, b.id
        """;

    // Derniers mouvements de la citerne, du plus récent au plus ancien.
    private const string TankMovementsSql = $"""
        SELECT
            m.id AS {nameof(TankMovementResponse.Id)},
            m.movement_number AS {nameof(TankMovementResponse.MovementNumber)},
            m.movement_date AS {nameof(TankMovementResponse.MovementDate)},
            m.movement_type_id AS {nameof(TankMovementResponse.MovementType)},
            mt.label AS {nameof(TankMovementResponse.MovementTypeLabel)},
            (m.destination_tank_id = @Id) AS {nameof(TankMovementResponse.IsIncoming)},
            m.quantity_liters AS {nameof(TankMovementResponse.QuantityLiters)},
            other.reference AS {nameof(TankMovementResponse.OtherTankCode)},
            b.batch_number AS {nameof(TankMovementResponse.BatchNumber)},
            po.id AS {nameof(TankMovementResponse.PressingOperationId)},
            po.operation_number AS {nameof(TankMovementResponse.PressingNumber)}

        FROM oil_movements m
        LEFT JOIN oil_movement_type mt
            ON mt.id = m.movement_type_id
        LEFT JOIN tanks other
            ON other.id = CASE WHEN m.destination_tank_id = @Id THEN m.source_tank_id ELSE m.destination_tank_id END
        LEFT JOIN oil_batches b
            ON b.id = m.oil_batch_id
        LEFT JOIN pressing_operations po
            ON po.id = b.production_batch_id

        WHERE m.destination_tank_id = @Id
           OR m.source_tank_id = @Id

        ORDER BY m.movement_date DESC, m.id DESC
        LIMIT 50
        """;

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
        var sql = new StringBuilder(TankSummarySelect);

        sql.Append("""

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.PageNumber - 1) * filter.PageSize);

        if (!string.IsNullOrWhiteSpace(filter.Code))
        {
            sql.Append(" AND t.reference ILIKE @Code");
            parameters.Add("Code", $"%{filter.Code}%");
        }

        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            sql.Append(" AND t.name ILIKE @Name");
            parameters.Add("Name", $"%{filter.Name}%");
        }

        if (filter.TankType.HasValue)
        {
            sql.Append(" AND t.tank_type_id = @TankType");
            parameters.Add("TankType", (int)filter.TankType.Value);
        }

        if (filter.OilCategory.HasValue)
        {
            sql.Append(" AND t.oil_category_id = @OilCategory");
            parameters.Add("OilCategory", (int)filter.OilCategory.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Status))
        {
            sql.Append(" AND t.status = @Status");
            parameters.Add("Status", filter.Status);
        }

        // Tampons d'abord, puis par code.
        sql.Append("""

            ORDER BY
                t.tank_type_id,
                t.reference

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var items = (await connection.QueryAsync<TankForListResponse>(
            sql.ToString(),
            parameters)).ToList();

        return new PagedResult<TankForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = items.FirstOrDefault()?.Total ?? 0,
            Items = items
        };
    }

    // ============================================================
    // GET DETAILS
    // ============================================================

    public async Task<TankDetailsResponse?> GetDetailsAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            {TankSummarySelect}
            WHERE t.id = @Id
            """;

        using var connection = _dbConnection;

        var tank = await connection.QuerySingleOrDefaultAsync<TankDetailsResponse>(
            sql,
            new { Id = id });

        if (tank is null)
        {
            return null;
        }

        tank.Contents = (await connection.QueryAsync<TankContentResponse>(
            TankContentsSql,
            new { Id = id })).ToList();

        tank.Movements = (await connection.QueryAsync<TankMovementResponse>(
            TankMovementsSql,
            new { Id = id })).ToList();

        return tank;
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<Tank?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT {TankColumns}
            FROM tanks t
            WHERE t.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Tank>(
            sql,
            new { Id = id });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Tank>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT {TankColumns}
            FROM tanks t
            ORDER BY t.tank_type_id, t.reference
            """;

        using var connection = _dbConnection;

        return (await connection.QueryAsync<Tank>(sql)).ToList();
    }

    // ============================================================
    // GET BY CODE
    // ============================================================

    public async Task<Tank?> GetByCodeAsync(
        string code,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT {TankColumns}
            FROM tanks t
            WHERE t.reference = @Code
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Tank>(
            sql,
            new { Code = code });
    }
}
