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

            oa.reference AS {nameof(OilAnalysisDetailsResponse.Reference)},

            oa.source_type_id AS {nameof(OilAnalysisDetailsResponse.SourceTypeId)},

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

            oa.analysis_date AS {nameof(OilAnalysisDetailsResponse.AnalysisDate)},

            oa.created_at AS {nameof(OilAnalysisDetailsResponse.CreatedAt)},

            oa.updated_at AS {nameof(OilAnalysisDetailsResponse.UpdatedAt)},

            oa.status AS {nameof(OilAnalysisDetailsResponse.Status)}

        FROM oil_analyses oa

        LEFT JOIN pressing_operations po
            ON oa.source_type_id = 1
            AND po.id = oa.source_id

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

            return await connection.QueryFirstOrDefaultAsync<OilAnalysisDetailsResponse>(
                command);
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

            // Filtre par date d'analyse
            if (filter.AnalysisDate.HasValue)
            {
                where.Append("""

                     AND oa.analysis_date::date = @AnalysisDate
                     """);

                parameters.Add(
                    "AnalysisDate",
                    filter.AnalysisDate.Value);
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

            // Liste
            var sql = $"""
                SELECT
                    oa.id AS {nameof(OilAnalysisForListResponse.Id)},
                
                    oa.reference AS {nameof(OilAnalysisForListResponse.Reference)},
                
                    CASE
                        WHEN oa.source_type_id = 1
                            THEN po.operation_number
                        WHEN oa.source_type_id = 2
                            THEN t.reference
                    END AS {nameof(OilAnalysisForListResponse.SourceReference)},
                
                    oa.analysis_date AS {nameof(OilAnalysisForListResponse.AnalysisDate)},
                
                    oa.created_at AS {nameof(OilAnalysisForListResponse.CreatedAt)},
                
                    oa.status AS {nameof(OilAnalysisForListResponse.Status)}
                
                {where}
                
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
