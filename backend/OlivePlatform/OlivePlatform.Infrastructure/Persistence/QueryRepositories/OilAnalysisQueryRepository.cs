using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Analysis.Repositories;
using OlivePlatform.Application.Features.Analysis.Requests;
using OlivePlatform.Application.Features.Analysis.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.Persistence.QueryRepositories
{
    public class OilAnalysisQueryRepository : IOilAnalysisQueryRepository
    {
        private readonly IDbConnection _dbConnection;

        // Flux d'huile par citerne et par lot : + à l'entrée, - à la sortie.
        private const string OilFlowsCte = """
            oil_flows AS (
                SELECT m.destination_tank_id AS tank_id, m.oil_batch_id, m.quantity_liters AS quantity
                FROM oil_movements m
                WHERE m.destination_tank_id IS NOT NULL

                UNION ALL

                SELECT m.source_tank_id AS tank_id, m.oil_batch_id, -m.quantity_liters AS quantity
                FROM oil_movements m
                WHERE m.source_tank_id IS NOT NULL
            )
            """;

        // Citernes contenant l'huile de l'analyse @Id : les lots de la pression
        // source, ou la citerne analysée elle-même.
        private const string OilLocationsSql = $"""
            WITH {OilFlowsCte},
            analysis AS (
                SELECT source_type_id, source_id FROM oil_analyses WHERE id = @Id
            ),
            located AS (
                SELECT f.tank_id, SUM(f.quantity) AS quantity,
                       STRING_AGG(DISTINCT b.batch_number, ', ') AS batch_numbers
                FROM oil_flows f
                INNER JOIN oil_batches b ON b.id = f.oil_batch_id
                INNER JOIN analysis a ON a.source_type_id = 1 AND b.production_batch_id = a.source_id
                GROUP BY f.tank_id
                HAVING SUM(f.quantity) > 0

                UNION ALL

                SELECT f.tank_id, SUM(f.quantity), NULL
                FROM oil_flows f
                INNER JOIN analysis a ON a.source_type_id = 2 AND f.tank_id = a.source_id
                GROUP BY f.tank_id
            )
            SELECT
                t.id AS {nameof(OilLocationResponse.TankId)},
                t.reference AS {nameof(OilLocationResponse.TankCode)},
                t.name AS {nameof(OilLocationResponse.TankName)},
                t.tank_type_id AS {nameof(OilLocationResponse.TankType)},
                tt.label AS {nameof(OilLocationResponse.TankTypeLabel)},
                oc.label AS {nameof(OilLocationResponse.OilCategoryLabel)},
                l.quantity AS {nameof(OilLocationResponse.QuantityLiters)},
                t.capacity_liters AS {nameof(OilLocationResponse.CapacityLiters)},
                l.batch_numbers AS {nameof(OilLocationResponse.BatchNumbers)}
            FROM located l
            INNER JOIN tanks t ON t.id = l.tank_id
            INNER JOIN tank_type tt ON tt.id = t.tank_type_id
            INNER JOIN oil_category oc ON oc.id = t.oil_category_id
            ORDER BY t.tank_type_id, t.reference
            """;

        public OilAnalysisQueryRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<OilAnalysisDetailsResponse?> GetOilAnalysisDetails(
    int id,
    CancellationToken cancellationToken = default)
        {
            var sql = $"""
        SELECT
            oa.id AS {nameof(OilAnalysisDetailsResponse.Id)},

            oa.season_id AS {nameof(OilAnalysisDetailsResponse.SeasonId)},

            oa.reference AS {nameof(OilAnalysisDetailsResponse.Reference)},

            oa.source_type_id AS {nameof(OilAnalysisDetailsResponse.SourceTypeId)},

            oa.source_id AS {nameof(OilAnalysisDetailsResponse.SourceId)},

            po.oil_quantity_liters AS {nameof(OilAnalysisDetailsResponse.OilQuantityLiters)},

            CASE
                WHEN oa.source_type_id = 1
                    THEN po.operation_number
                WHEN oa.source_type_id = 2
                    THEN t.reference
            END AS {nameof(OilAnalysisDetailsResponse.SourceReference)},

            oa.acidity_percentage AS {nameof(OilAnalysisDetailsResponse.AcidityPercentage)},

            oa.peroxide_index AS {nameof(OilAnalysisDetailsResponse.PeroxideIndex)},

            oa.k232 AS {nameof(OilAnalysisDetailsResponse.K232)},

            oa.k270 AS {nameof(OilAnalysisDetailsResponse.K270)},

            oa.organoleptic_grade AS {nameof(OilAnalysisDetailsResponse.OrganolepticGrade)},

            oa.planned_date AS {nameof(OilAnalysisDetailsResponse.PlannedDate)},

            oa.start_time AS {nameof(OilAnalysisDetailsResponse.StartTime)},

            oa.end_time AS {nameof(OilAnalysisDetailsResponse.EndTime)},

            oa.created_at AS {nameof(OilAnalysisDetailsResponse.CreatedAt)},

            oa.updated_at AS {nameof(OilAnalysisDetailsResponse.UpdatedAt)},

            oa.status AS {nameof(OilAnalysisDetailsResponse.Status)},

            oa.oil_category_id AS {nameof(OilAnalysisDetailsResponse.OilCategory)},

            category.label AS {nameof(OilAnalysisDetailsResponse.OilCategoryLabel)}

        FROM oil_analyses oa

        LEFT JOIN pressing_operations po
            ON oa.source_type_id = 1
            AND po.id = oa.source_id

        LEFT JOIN oil_category category
            ON category.id = oa.oil_category_id

        LEFT JOIN tanks t
            ON oa.source_type_id = 2
            AND t.id = oa.source_id

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

            var analysis = await connection.QueryFirstOrDefaultAsync<OilAnalysisDetailsResponse>(
                command);

            if (analysis is null)
            {
                return null;
            }

            analysis.OilLocations = (await connection.QueryAsync<OilLocationResponse>(
                new CommandDefinition(
                    OilLocationsSql,
                    new { Id = id },
                    cancellationToken: cancellationToken))).ToList();

            return analysis;
        }

        public async Task<PagedResult<OilAnalysisForListResponse>> GetOilAnalysisList(OilAnalysesRequestFilter filter, CancellationToken cancellationToken)
        {
            var where = new StringBuilder("""
                FROM oil_analyses oa
                
                LEFT JOIN pressing_operations po
                    ON oa.source_type_id = 1
                    AND po.id = oa.source_id
                
                LEFT JOIN tanks t
                    ON oa.source_type_id = 2
                    AND t.id = oa.source_id
                
                WHERE 1 = 1
                """);

            var parameters = new DynamicParameters();

            // Filtre par référence
            if (!string.IsNullOrWhiteSpace(filter.Reference))
            {
                where.Append("""

                    AND oa.reference ILIKE @Reference
                    """);

                parameters.Add(
                    "Reference",
                    $"%{filter.Reference.Trim()}%");
            }

            // Filtre par référence de la pression source
            if (!string.IsNullOrWhiteSpace(filter.PressingReference))
            {
                where.Append("""

                    AND po.operation_number ILIKE @PressingReference
                    """);

                parameters.Add(
                    "PressingReference",
                    $"%{filter.PressingReference.Trim()}%");
            }

            // Du : début de l'analyse (start_time)
            if (filter.FromDate.HasValue)
            {
                where.Append("""

                    AND oa.start_time::date >= @FromDate
                    """);

                parameters.Add(
                    "FromDate",
                    filter.FromDate.Value.ToDateTime(TimeOnly.MinValue));
            }

            // Au : fin de l'analyse (end_time)
            if (filter.ToDate.HasValue)
            {
                where.Append("""

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
                where.Append(
                    """
    
                    AND oa.season_id = @SeasonId
                    """);
    
                parameters.Add(
                    "SeasonId",
                    filter.SeasonId.Value);
            }
    
            // Filtre par statut
            if (filter.Status.HasValue)
            {
                where.Append("""

                    AND oa.status = @Status
                    """);

                parameters.Add(
                    "Status",
                    filter.Status.Value);
            }

            // Pagination
            var page = filter.PageNumber <= 0
                ? 1
                : filter.PageNumber;

            var pageSize = filter.PageSize <= 0
                ? 20
                : filter.PageSize;

            var offset = (page - 1) * pageSize;

            parameters.Add("Offset", offset);
            parameters.Add("PageSize", pageSize);

            // Total
            var countSql = $"""
            SELECT COUNT(*)
                {where}
            """;

            // Citernes qui contiennent l'huile de la pression source.
            const string locationJoin = """
                LEFT JOIN LATERAL (
                    SELECT STRING_AGG(t2.reference || COALESCE(' · ' || t2.name, ''), ', ' ORDER BY t2.reference) AS tank_codes
                    FROM (
                        SELECT f.tank_id
                        FROM oil_flows f
                        INNER JOIN oil_batches b ON b.id = f.oil_batch_id
                        WHERE oa.source_type_id = 1
                          AND b.production_batch_id = oa.source_id
                        GROUP BY f.tank_id
                        HAVING SUM(f.quantity) > 0
                    ) held
                    INNER JOIN tanks t2 ON t2.id = held.tank_id
                ) location ON TRUE

                WHERE 1 = 1
                """;

            var listFrom = where.ToString().Replace("WHERE 1 = 1", locationJoin);

            // Liste
            var sql = $"""
                WITH {OilFlowsCte}

                SELECT
                    oa.id AS {nameof(OilAnalysisForListResponse.Id)},

                    oa.season_id AS {nameof(OilAnalysisForListResponse.SeasonId)},
                
                    oa.reference AS {nameof(OilAnalysisForListResponse.Reference)},
                
                    CASE
                        WHEN oa.source_type_id = 1
                            THEN po.operation_number
                        WHEN oa.source_type_id = 2
                            THEN t.reference
                    END AS {nameof(OilAnalysisForListResponse.SourceReference)},

                    oa.source_type_id AS {nameof(OilAnalysisForListResponse.SourceTypeId)},

                    location.tank_codes AS {nameof(OilAnalysisForListResponse.OilLocation)},

                    oa.planned_date AS {nameof(OilAnalysisForListResponse.PlannedDate)},
                
                    oa.start_time AS {nameof(OilAnalysisForListResponse.StartTime)},
                
                    oa.end_time AS {nameof(OilAnalysisForListResponse.EndTime)},
                
                    oa.created_at AS {nameof(OilAnalysisForListResponse.CreatedAt)},
                
                    oa.status AS {nameof(OilAnalysisForListResponse.Status)}

                {listFrom}
                
                ORDER BY oa.created_at DESC, oa.id DESC
                
                OFFSET @Offset
                LIMIT @PageSize;
                """;

            using var connection = _dbConnection;

            var total = await connection.ExecuteScalarAsync<int>(
                new CommandDefinition(
                    countSql,
                    parameters,
                    cancellationToken: cancellationToken));

            var items = await connection.QueryAsync<OilAnalysisForListResponse>(
                new CommandDefinition(
                    sql,
                    parameters,
                    cancellationToken: cancellationToken));

            return new PagedResult<OilAnalysisForListResponse>
            {
                Items = items.ToList(),
                TotalCount = total,
                PageNumber = page,
                PageSize = pageSize
            };
        }
    }

}
