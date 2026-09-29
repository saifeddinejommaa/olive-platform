using Dapper;
using OlivePlatform.Application.Features.AppConstants.Repositories;
using OlivePlatform.Application.Features.AppConstants.Responses;
using System.Data;

public class ReferenceDataQueryRepository
    : IAppConstantsQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public ReferenceDataQueryRepository(
        IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<AppConstantsResponse> GetAppConstants(
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            SELECT id AS {nameof(AppConstantItemResponse.Id)}, 
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM olive_varieties
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)}, 
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM purchase_status
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM production_status
            WHERE is_active = TRUE
            ORDER BY label;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM oil_movement_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM invoice_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM invoice_status
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM payment_method
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM cost_line_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM harvest_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM plot_harvest_state
            WHERE is_active = TRUE
            ORDER BY id;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM olive_lot_status
            WHERE is_active = TRUE
            ORDER BY id;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM tank_type
            WHERE is_active = TRUE
            ORDER BY id;

            SELECT id AS {nameof(AppConstantItemResponse.Id)},
                label AS {nameof(AppConstantItemResponse.Name)}
            FROM oil_category
            WHERE is_active = TRUE
            ORDER BY id;
            """;

        using var connection = _dbConnection;

        using var multi =
            await connection.QueryMultipleAsync(sql);

        return new AppConstantsResponse
        {
            OliveVarieties =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            PurchaseStatus =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            ProductionStatus =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            OilMovementTypes =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            InvoiceTypes =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            InvoiceStatuses =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            PaymentMethods =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            CostLineType =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),
            HarvestTypes = (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            PlotHarvestStates =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            OliveLotStatuses =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            TankTypes =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            OilCategories =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList()
        };
    }
}