using Dapper;
using OlivePlatform.Application.Features.Indicators.Repositories;
using OlivePlatform.Application.Features.Indicators.Responses;
using System.Data;
using System.Globalization;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class IndicatorQueryRepository : IIndicatorQueryRepository
{
    // Densité de l'huile d'olive (kg / L) : rendement en poids.
    private const decimal OliveOilDensity = 0.916m;

    private readonly IDbConnection _dbConnection;

    // Une ligne par lot pressé dans une pression terminée, avec l'huile qui lui
    // revient : huile de la pression × kg du lot ÷ kg totaux de la pression.
    private const string YieldRowsSql = """
        WITH pressings AS (
            SELECT
                po.id,
                po.end_time,
                po.oil_quantity_liters,
                SUM(i.quantity_kg) AS total_kg
            FROM pressing_operations po
            INNER JOIN pressing_operation_inputs i ON i.pressing_operation_id = po.id
            WHERE po.status_id = 3
              AND po.oil_quantity_liters > 0
              AND po.season_id = COALESCE(@SeasonId, po.season_id)
            GROUP BY po.id
        ),
        inputs AS (
            SELECT
                p.id AS pressing_id,
                p.end_time,
                i.quantity_kg,
                p.oil_quantity_liters * i.quantity_kg / NULLIF(p.total_kg, 0) AS oil_liters,
                COALESCE(l.variety_id, h.variety_id) AS variety_id,
                h.plot_id,
                op.supplier_id
            FROM pressings p
            INNER JOIN pressing_operation_inputs i ON i.pressing_operation_id = p.id
            INNER JOIN olive_lots l ON l.id = i.lot_id
            LEFT JOIN harvests h ON h.id = l.harvest_id
            LEFT JOIN olive_purchases op ON op.id = l.purchase_id
        )
        SELECT
            inp.pressing_id AS PressingId,
            inp.end_time AS EndTime,
            inp.quantity_kg AS OliveKg,
            inp.oil_liters AS OilLiters,
            inp.variety_id AS VarietyId,
            v.label AS VarietyLabel,
            inp.plot_id AS PlotId,
            CASE WHEN pl.id IS NULL THEN NULL
                 ELSE pl.reference || COALESCE(' · ' || pl.name, '') END AS PlotLabel,
            inp.supplier_id AS SupplierId,
            s.name AS SupplierLabel,
            -- Pression à plusieurs variétés : son rendement est une moyenne.
            COALESCE(
                MIN(inp.variety_id) OVER (PARTITION BY inp.pressing_id)
                    <> MAX(inp.variety_id) OVER (PARTITION BY inp.pressing_id),
                FALSE) AS IsMixed
        FROM inputs inp
        LEFT JOIN olive_varieties v ON v.id = inp.variety_id
        LEFT JOIN plots pl ON pl.id = inp.plot_id
        LEFT JOIN supplier s ON s.id = inp.supplier_id
        """;

    public IndicatorQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<YieldIndicatorsResponse> GetYieldsAsync(
        int? seasonId,
        CancellationToken cancellationToken = default)
    {
        using var connection = _dbConnection;

        var rows = (await connection.QueryAsync<YieldRow>(
            new CommandDefinition(
                YieldRowsSql,
                new { SeasonId = seasonId },
                cancellationToken: cancellationToken))).ToList();

        var french = CultureInfo.GetCultureInfo("fr-FR");

        return new YieldIndicatorsResponse
        {
            Totals = Aggregate("total", "Campagne", rows),

            ByVariety = Group(
                rows,
                row => row.VarietyId?.ToString() ?? "none",
                row => row.VarietyLabel ?? "Variété non renseignée"),

            // Parcelles : seulement les olives récoltées.
            ByPlot = Group(
                rows.Where(row => row.PlotId is not null),
                row => row.PlotId!.Value.ToString(),
                row => row.PlotLabel ?? "-"),

            // Fournisseurs : seulement les olives achetées.
            BySupplier = Group(
                rows.Where(row => row.SupplierId is not null),
                row => row.SupplierId!.Value.ToString(),
                row => row.SupplierLabel ?? "-"),

            ByMonth = Group(
                    rows.Where(row => row.EndTime is not null),
                    row => row.EndTime!.Value.ToString("yyyy-MM"),
                    row => french.TextInfo.ToTitleCase(row.EndTime!.Value.ToString("MMMM yyyy", french)))
                .OrderBy(group => group.Key)
                .ToList(),
        };
    }

    // Regroupe les lots et trie du meilleur au moins bon rendement.
    private static List<YieldRowResponse> Group(
        IEnumerable<YieldRow> rows,
        Func<YieldRow, string> keyOf,
        Func<YieldRow, string> labelOf)
    {
        return rows
            .GroupBy(keyOf)
            .Select(group => Aggregate(group.Key, labelOf(group.First()), group.ToList()))
            .OrderByDescending(row => row.LitersPer100Kg)
            .ToList();
    }

    private static YieldRowResponse Aggregate(string key, string label, IReadOnlyCollection<YieldRow> rows)
    {
        var oliveKg = rows.Sum(row => row.OliveKg);
        var oilLiters = rows.Sum(row => row.OilLiters);

        return new YieldRowResponse
        {
            Key = key,
            Label = label,
            PressingsCount = rows.Select(row => row.PressingId).Distinct().Count(),
            OliveKg = Math.Round(oliveKg, 1),
            OilLiters = Math.Round(oilLiters, 1),
            LitersPer100Kg = oliveKg > 0 ? Math.Round(oilLiters / oliveKg * 100, 2) : 0,
            YieldPercentage = oliveKg > 0 ? Math.Round(oilLiters * OliveOilDensity / oliveKg * 100, 2) : 0,
            MixedPressingsCount = rows.Where(row => row.IsMixed).Select(row => row.PressingId).Distinct().Count(),
        };
    }

    // Lot pressé, avec l'huile qui lui revient.
    private sealed class YieldRow
    {
        public int PressingId { get; set; }

        public DateTime? EndTime { get; set; }

        public decimal OliveKg { get; set; }

        public decimal OilLiters { get; set; }

        public int? VarietyId { get; set; }

        public string? VarietyLabel { get; set; }

        public int? PlotId { get; set; }

        public string? PlotLabel { get; set; }

        public long? SupplierId { get; set; }

        public string? SupplierLabel { get; set; }

        public bool IsMixed { get; set; }
    }
}
