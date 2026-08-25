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
        const string sql = """
            SELECT id AS Id, label AS Name
            FROM olive_varieties
            ORDER BY name;

            SELECT id AS Id, code AS Code, name AS Name
            FROM purchase_status
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS Id, code AS Code, name AS Name
            FROM sample_status
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS Id, label AS Code
            FROM production_status
            WHERE is_active = TRUE
            ORDER BY label;

            SELECT id AS Id, code AS Code, name AS Name
            FROM oil_movement_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS Id, code AS Code, name AS Name
            FROM invoice_type
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS Id, code AS Code, name AS Name
            FROM invoice_status
            WHERE is_active = TRUE
            ORDER BY name;

            SELECT id AS Id, code AS Code, name AS Name
            FROM payment_method
            WHERE is_active = TRUE
            ORDER BY name;
            """;

        using var connection = _dbConnection;

        using var multi =
            await connection.QueryMultipleAsync(sql);

        return new AppConstantsResponse
        {
            OliveVarieties =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            PurchaseStatuses =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            SampleStatuses =
                (await multi.ReadAsync<AppConstantItemResponse>())
                .ToList(),

            ProductionStatuses =
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
                .ToList()
        };
    }
}