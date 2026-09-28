using Dapper;
using OlivePlatform.Application.Features.OliveLots.Repositories;
using OlivePlatform.Application.Features.OliveLots.Requests;
using OlivePlatform.Application.Features.OliveLots.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OliveLotQueryRepository : IOliveLotQueryRepository
{
    private readonly IDbConnection _dbConnection;

    private const string SelectSql = $"""
        SELECT
            pl.id AS {nameof(OliveLotResponse.Id)},
            pl.reference AS {nameof(OliveLotResponse.Reference)},
            pl.source_type_id AS {nameof(OliveLotResponse.SourceType)},
            pl.harvest_id AS {nameof(OliveLotResponse.HarvestId)},
            pl.purchase_id AS {nameof(OliveLotResponse.PurchaseId)},
            COALESCE(h.reference, op.reference) AS {nameof(OliveLotResponse.SourceReference)},
            pl.variety_id AS {nameof(OliveLotResponse.VarietyId)},
            pl.quantity_kg AS {nameof(OliveLotResponse.QuantityKg)},
            pl.remaining_kg AS {nameof(OliveLotResponse.RemainingKg)},
            pl.price_per_kg AS {nameof(OliveLotResponse.PricePerKg)},
            pl.status_id AS {nameof(OliveLotResponse.Status)},
            pl.need_analysis AS {nameof(OliveLotResponse.NeedAnalysis)},
            pl.olive_analysis_id AS {nameof(OliveLotResponse.OliveAnalysisId)},
            oa.reference AS {nameof(OliveLotResponse.OliveAnalysisReference)},
            oa.status AS {nameof(OliveLotResponse.AnalysisStatus)},
            oa.oil_percentage AS {nameof(OliveLotResponse.OilPercentage)},
            COALESCE(oa.status = 3, FALSE) AS {nameof(OliveLotResponse.IsAnalyzed)},
            (pl.need_analysis AND COALESCE(oa.status <> 3, TRUE)) AS {nameof(OliveLotResponse.ToAnalysis)},
            ({OliveLotSql.PressableCondition}) AS {nameof(OliveLotResponse.IsPressable)},
            pl.notes AS {nameof(OliveLotResponse.Notes)},
            pl.created_at AS {nameof(OliveLotResponse.CreatedAt)},
            pl.updated_at AS {nameof(OliveLotResponse.UpdatedAt)}
        FROM olive_lots pl
        LEFT JOIN harvests h
            ON h.id = pl.harvest_id
        LEFT JOIN olive_purchases op
            ON op.id = pl.purchase_id
        LEFT JOIN olive_analyses oa
            ON oa.id = pl.olive_analysis_id
        WHERE 1 = 1
        """;

    public OliveLotQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<List<OliveLotResponse>> GetLots(
        OliveLotsRequestFilter filter,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(SelectSql);
        var parameters = new DynamicParameters();

        if (filter.SeasonId.HasValue)
        {
            sql.Append(" AND pl.season_id = @SeasonId");
            parameters.Add("SeasonId", filter.SeasonId.Value);
        }

        if (filter.HarvestId.HasValue)
        {
            sql.Append(" AND pl.harvest_id = @HarvestId");
            parameters.Add("HarvestId", filter.HarvestId.Value);
        }

        if (filter.PurchaseId.HasValue)
        {
            sql.Append(" AND pl.purchase_id = @PurchaseId");
            parameters.Add("PurchaseId", filter.PurchaseId.Value);
        }

        if (filter.SourceType.HasValue)
        {
            sql.Append(" AND pl.source_type_id = @SourceType");
            parameters.Add("SourceType", (int)filter.SourceType.Value);
        }

        if (filter.Status.HasValue)
        {
            sql.Append(" AND pl.status_id = @Status");
            parameters.Add("Status", (int)filter.Status.Value);
        }

        if (filter.Available == true)
        {
            sql.Append(" AND pl.remaining_kg > 0 AND pl.status_id IN (1, 2)");
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            sql.Append("""
                 AND (
                    pl.reference ILIKE @Search
                    OR h.reference ILIKE @Search
                    OR op.reference ILIKE @Search
                )
                """);
            parameters.Add("Search", $"%{filter.Search.Trim()}%");
        }

        sql.Append(" ORDER BY pl.created_at DESC, pl.id DESC");

        using var connection = _dbConnection;

        var lots = await connection.QueryAsync<OliveLotResponse>(
            new CommandDefinition(
                sql.ToString(),
                parameters,
                cancellationToken: cancellationToken));

        return lots.ToList();
    }

    public async Task<OliveLotResponse?> GetLot(
        long id,
        CancellationToken cancellationToken = default)
    {
        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<OliveLotResponse>(
            new CommandDefinition(
                SelectSql + " AND pl.id = @Id",
                new { Id = id },
                cancellationToken: cancellationToken));
    }
}
