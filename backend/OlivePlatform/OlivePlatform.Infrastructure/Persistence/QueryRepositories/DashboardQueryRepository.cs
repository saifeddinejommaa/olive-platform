using Dapper;
using OlivePlatform.Application.Features.Dashboard.Responses;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Infrastructure.QueryRepositories;
using System.Data;

namespace OlivePlatform.Infrastructure.Repositories;

public class DashboardQueryRepository : IDashboardQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public DashboardQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<DashboardSummaryResponse> GetDashboardSummary(
        int? seasonId,
        int pressingComparisonLimit,
        CancellationToken cancellationToken = default)
    {
        // Chaque indicateur (sauf les cuves) porte sur la campagne demandée ;
        // sans campagne, sur toutes.
        var sql = $"""
        -- 1) Pipeline récolte
        SELECT
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.Planned})    AS {nameof(ProductionPipelineResponse.PlannedCount)},
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.InProgress}) AS {nameof(ProductionPipelineResponse.InProgressCount)},
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.Completed})  AS {nameof(ProductionPipelineResponse.CompletedCount)}
        FROM public.harvests
        WHERE season_id = COALESCE(@SeasonId, season_id);

        -- 2) Pipeline pression
        SELECT
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.Planned})    AS {nameof(ProductionPipelineResponse.PlannedCount)},
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.InProgress}) AS {nameof(ProductionPipelineResponse.InProgressCount)},
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.Completed})  AS {nameof(ProductionPipelineResponse.CompletedCount)}
        FROM public.pressing_operations
        WHERE season_id = COALESCE(@SeasonId, season_id);

        -- 3) Couverture arbres : total des parcelles (compté une seule fois)
        --    et arbres des récoltes de la campagne.
        SELECT
            (SELECT COALESCE(SUM(p.number_of_trees), 0) FROM public.plots p)
                AS {nameof(TreesCoverageResponse.TotalTrees)},

            (SELECT COALESCE(SUM(h.harvested_trees), 0)
             FROM public.harvests h
             WHERE h.status = {(int)ProductionStatus.Completed}
               AND h.season_id = COALESCE(@SeasonId, h.season_id))
                AS {nameof(TreesCoverageResponse.HarvestedTrees)},

            (SELECT COALESCE(SUM(h.planned_trees), 0)
             FROM public.harvests h
             WHERE h.status IN ({(int)ProductionStatus.Planned}, {(int)ProductionStatus.InProgress})
               AND h.season_id = COALESCE(@SeasonId, h.season_id))
                AS {nameof(TreesCoverageResponse.PlannedTrees)};

        -- 4) Lots d'olives par état (kg et nombre de lots)
        SELECT lots.*, used.*
        FROM (
            SELECT
                COUNT(*) AS {nameof(OliveLotsOverviewResponse.TotalLots)},
                COALESCE(SUM(pl.quantity_kg), 0) AS {nameof(OliveLotsOverviewResponse.TotalKg)},
                COALESCE(SUM(pl.quantity_kg) FILTER (WHERE pl.source_type_id = 1), 0)
                    AS {nameof(OliveLotsOverviewResponse.HarvestKg)},
                COALESCE(SUM(pl.quantity_kg) FILTER (WHERE pl.source_type_id = 2), 0)
                    AS {nameof(OliveLotsOverviewResponse.PurchaseKg)},

                COALESCE(SUM(pl.remaining_kg) FILTER (WHERE {OliveLotSql.PressableCondition}), 0)
                    AS {nameof(OliveLotsOverviewResponse.ReadyKg)},
                COUNT(*) FILTER (WHERE {OliveLotSql.PressableCondition})
                    AS {nameof(OliveLotsOverviewResponse.ReadyLots)},

                COALESCE(SUM(pl.remaining_kg) FILTER (
                    WHERE {OliveLotSql.SelectableCondition}
                      AND NOT ({OliveLotSql.PressableCondition})
                ), 0) AS {nameof(OliveLotsOverviewResponse.PendingAnalysisKg)},
                COUNT(*) FILTER (
                    WHERE {OliveLotSql.SelectableCondition}
                      AND NOT ({OliveLotSql.PressableCondition})
                ) AS {nameof(OliveLotsOverviewResponse.PendingAnalysisLots)}
            FROM public.olive_lots pl
            WHERE pl.season_id = COALESCE(@SeasonId, pl.season_id)
        ) lots
        CROSS JOIN (
            SELECT
                COALESCE(SUM(poi.quantity_kg) FILTER (
                    WHERE po.status_id = {(int)ProductionStatus.Completed}
                ), 0) AS {nameof(OliveLotsOverviewResponse.PressedKg)},
                COUNT(DISTINCT poi.lot_id) FILTER (
                    WHERE po.status_id = {(int)ProductionStatus.Completed}
                ) AS {nameof(OliveLotsOverviewResponse.PressedLots)},

                COALESCE(SUM(poi.quantity_kg) FILTER (
                    WHERE po.status_id IN ({(int)ProductionStatus.Planned}, {(int)ProductionStatus.InProgress})
                      AND poi.status = {(int)PressingOperationInputStatus.Reserved}
                ), 0) AS {nameof(OliveLotsOverviewResponse.InPressingKg)},
                COUNT(DISTINCT poi.lot_id) FILTER (
                    WHERE po.status_id IN ({(int)ProductionStatus.Planned}, {(int)ProductionStatus.InProgress})
                      AND poi.status = {(int)PressingOperationInputStatus.Reserved}
                ) AS {nameof(OliveLotsOverviewResponse.InPressingLots)}
            FROM public.pressing_operation_inputs poi
            INNER JOIN public.pressing_operations po
                ON po.id = poi.pressing_operation_id
            INNER JOIN public.olive_lots l
                ON l.id = poi.lot_id
            WHERE l.season_id = COALESCE(@SeasonId, l.season_id)
        ) used;

        -- 5) Pression : réel vs attendu (dernières opérations terminées)
        SELECT
            operation_number AS {nameof(PressingComparisonPointResponse.OperationNumber)},
            oil_quantity_liters AS {nameof(PressingComparisonPointResponse.ActualLiters)},
            expected_oil_liters AS {nameof(PressingComparisonPointResponse.ExpectedLiters)},
            oil_yield_deviation_liters AS {nameof(PressingComparisonPointResponse.DeviationLiters)}
        FROM public.pressing_operations
        WHERE status_id = {(int)ProductionStatus.Completed}
          AND season_id = COALESCE(@SeasonId, season_id)
        ORDER BY end_time DESC NULLS LAST
        LIMIT @PressingComparisonLimit;

        -- 6) Occupation cuves (agrégée, via solde des mouvements ; toutes campagnes)
        SELECT
            COALESCE(SUM(t.capacity_liters), 0) AS {nameof(TankOccupancyResponse.TotalCapacityLiters)},

            COALESCE(SUM(
                COALESCE(inflow.qty, 0) - COALESCE(outflow.qty, 0)
            ), 0) AS {nameof(TankOccupancyResponse.CurrentLevelLiters)}

        FROM public.tanks t

        LEFT JOIN (
            SELECT destination_tank_id AS tank_id, SUM(quantity_liters) AS qty
            FROM public.oil_movements
            WHERE destination_tank_id IS NOT NULL
            GROUP BY destination_tank_id
        ) inflow ON inflow.tank_id = t.id

        LEFT JOIN (
            SELECT source_tank_id AS tank_id, SUM(quantity_liters) AS qty
            FROM public.oil_movements
            WHERE source_tank_id IS NOT NULL
            GROUP BY source_tank_id
        ) outflow ON outflow.tank_id = t.id;

        -- 7) Charges : total / réglé / restant (récolte + achats d'olives)
        SELECT
            COALESCE(harvest_totals.total, 0) + COALESCE(purchase_totals.total, 0)
                AS {nameof(ChargesCoverageResponse.TotalAmount)},

            COALESCE(harvest_totals.paid, 0) + COALESCE(purchase_totals.paid, 0)
                AS {nameof(ChargesCoverageResponse.PaidAmount)},

            COALESCE(harvest_totals.unpaid, 0) + COALESCE(purchase_totals.unpaid, 0)
                AS {nameof(ChargesCoverageResponse.UnpaidAmount)}

        FROM (
            SELECT
                SUM(hcl.total_amount) AS total,
                SUM(hcl.paid_amount) AS paid,
                SUM(hcl.unpaid_amount) AS unpaid
            FROM public.harvest_cost_line hcl
            INNER JOIN public.harvests h
                ON h.id = hcl.harvest_id
            WHERE h.season_id = COALESCE(@SeasonId, h.season_id)
        ) harvest_totals

        CROSS JOIN (
            SELECT
                SUM(paid_amount + unpaid_amount) AS total,
                SUM(paid_amount) AS paid,
                SUM(unpaid_amount) AS unpaid
            FROM public.olive_purchases
            WHERE season_id = COALESCE(@SeasonId, season_id)
        ) purchase_totals;

        -- 8) Dépenses vs gains : charges (récolte + achats d'olives)
        --    contre ventes d'huile livrées (HT : la TVA n'est pas un gain).
        SELECT
            COALESCE((
                SELECT SUM(hcl.total_amount)
                FROM public.harvest_cost_line hcl
                INNER JOIN public.harvests h ON h.id = hcl.harvest_id
                WHERE h.season_id = COALESCE(@SeasonId, h.season_id)
            ), 0)
            + COALESCE((
                SELECT SUM(op.paid_amount + op.unpaid_amount)
                FROM public.olive_purchases op
                WHERE op.season_id = COALESCE(@SeasonId, op.season_id)
            ), 0) AS {nameof(IncomeVsExpensesResponse.ExpensesAmount)},

            COALESCE((
                SELECT SUM(s.subtotal)
                FROM public.oil_sales s
                WHERE s.status_id = 2
                  AND s.season_id = COALESCE(@SeasonId, s.season_id)
            ), 0) AS {nameof(IncomeVsExpensesResponse.IncomeAmount)};
        """;

        using var connection = _dbConnection;

        using var multi = await connection.QueryMultipleAsync(
            new CommandDefinition(
                sql,
                new
                {
                    SeasonId = seasonId,
                    PressingComparisonLimit = pressingComparisonLimit,
                },
                cancellationToken: cancellationToken));

        var harvestPipeline = await multi.ReadSingleAsync<ProductionPipelineResponse>();
        var pressingPipeline = await multi.ReadSingleAsync<ProductionPipelineResponse>();
        var treesCoverage = await multi.ReadSingleAsync<TreesCoverageResponse>();
        var oliveLots = await multi.ReadSingleAsync<OliveLotsOverviewResponse>();
        var pressingComparison = (await multi.ReadAsync<PressingComparisonPointResponse>()).AsList();
        var tankOccupancy = await multi.ReadSingleAsync<TankOccupancyResponse>();
        var chargesCoverage = await multi.ReadSingleAsync<ChargesCoverageResponse>();
        var incomeVsExpenses = await multi.ReadSingleAsync<IncomeVsExpensesResponse>();

        return new DashboardSummaryResponse
        {
            HarvestPipeline = harvestPipeline,
            PressingPipeline = pressingPipeline,
            TreesCoverage = treesCoverage,
            OliveLots = oliveLots,
            PressingComparison = pressingComparison,
            TankOccupancy = tankOccupancy,
            ChargesCoverage = chargesCoverage,
            IncomeVsExpenses = incomeVsExpenses,
        };
    }
}
