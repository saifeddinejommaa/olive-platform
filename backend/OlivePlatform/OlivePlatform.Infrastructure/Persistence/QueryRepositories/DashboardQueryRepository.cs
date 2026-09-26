using Dapper;
using OlivePlatform.Application.Features.Dashboard.Responses;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
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
        DateTime harvestYieldFromDate,
        int pressingComparisonLimit,
        CancellationToken cancellationToken = default)
    {
        var sql = $"""
        -- 1) Pipeline récolte
        SELECT
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.Planned})    AS {nameof(ProductionPipelineResponse.PlannedCount)},
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.InProgress}) AS {nameof(ProductionPipelineResponse.InProgressCount)},
            COUNT(*) FILTER (WHERE status = {(int)ProductionStatus.Completed})  AS {nameof(ProductionPipelineResponse.CompletedCount)}
        FROM public.harvests;

        -- 2) Pipeline pression
        SELECT
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.Planned})    AS {nameof(ProductionPipelineResponse.PlannedCount)},
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.InProgress}) AS {nameof(ProductionPipelineResponse.InProgressCount)},
            COUNT(*) FILTER (WHERE status_id = {(int)ProductionStatus.Completed})  AS {nameof(ProductionPipelineResponse.CompletedCount)}
        FROM public.pressing_operations;

        -- 3) Couverture arbres (toutes parcelles)
        SELECT
            COALESCE(SUM(p.number_of_trees), 0) AS {nameof(TreesCoverageResponse.TotalTrees)},

            COALESCE(SUM(h.harvested_trees) FILTER (
                WHERE h.status = {(int)ProductionStatus.Completed}
            ), 0) AS {nameof(TreesCoverageResponse.HarvestedTrees)},

            COALESCE(SUM(h.planned_trees) FILTER (
                WHERE h.status IN ({(int)ProductionStatus.Planned}, {(int)ProductionStatus.InProgress})
            ), 0) AS {nameof(TreesCoverageResponse.PlannedTrees)}

        FROM public.plots p
        LEFT JOIN public.harvests h ON h.plot_id = p.id;

        -- 4) Rendement récolte par jour
        SELECT
            planned_date::date AS {nameof(HarvestYieldPointResponse.Date)},
            SUM(quantity_kg) AS {nameof(HarvestYieldPointResponse.QuantityKg)}
        FROM public.harvests
        WHERE planned_date::date >= @HarvestYieldFromDate
        GROUP BY planned_date::date
        ORDER BY planned_date::date;

        -- 5) Pression : réel vs attendu (dernières opérations terminées)
        SELECT
            operation_number AS {nameof(PressingComparisonPointResponse.OperationNumber)},
            oil_quantity_liters AS {nameof(PressingComparisonPointResponse.ActualLiters)},
            expected_oil_liters AS {nameof(PressingComparisonPointResponse.ExpectedLiters)},
            oil_yield_deviation_liters AS {nameof(PressingComparisonPointResponse.DeviationLiters)}
        FROM public.pressing_operations
        WHERE status_id = {(int)ProductionStatus.Completed}
        ORDER BY end_time DESC NULLS LAST
        LIMIT @PressingComparisonLimit;

        -- 6) Occupation cuves (agrégée, via solde des mouvements)
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
                SUM(total_amount) AS total,
                SUM(paid_amount) AS paid,
                SUM(unpaid_amount) AS unpaid
            FROM public.harvest_cost_line
        ) harvest_totals

        CROSS JOIN (
            SELECT
                SUM(paid_amount + unpaid_amount) AS total,
                SUM(paid_amount) AS paid,
                SUM(unpaid_amount) AS unpaid
            FROM public.olive_purchases
        ) purchase_totals;
        """;

        using var connection = _dbConnection;

        using var multi = await connection.QueryMultipleAsync(
            sql,
            new
            {
                HarvestYieldFromDate = harvestYieldFromDate,
                PressingComparisonLimit = pressingComparisonLimit,
            });

        var harvestPipeline = await multi.ReadSingleAsync<ProductionPipelineResponse>();
        var pressingPipeline = await multi.ReadSingleAsync<ProductionPipelineResponse>();
        var treesCoverage = await multi.ReadSingleAsync<TreesCoverageResponse>();
        var harvestYield = (await multi.ReadAsync<HarvestYieldPointResponse>()).AsList();
        var pressingComparison = (await multi.ReadAsync<PressingComparisonPointResponse>()).AsList();
        var tankOccupancy = await multi.ReadSingleAsync<TankOccupancyResponse>();
        var chargesCoverage = await multi.ReadSingleAsync<ChargesCoverageResponse>();


        return new DashboardSummaryResponse
        {
            HarvestPipeline = harvestPipeline,
            PressingPipeline = pressingPipeline,
            TreesCoverage = treesCoverage,
            HarvestYield = harvestYield,
            PressingComparison = pressingComparison,
            TankOccupancy = tankOccupancy,
            ChargesCoverage = chargesCoverage,
        };
    }
}