using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OilSales.Repositories;
using OlivePlatform.Application.Features.OilSales.Requests;
using OlivePlatform.Application.Features.OilSales.Responses;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class OilSaleQueryRepository : IOilSaleQueryRepository
{
    private readonly IDbConnection _dbConnection;

    // Vente avec son client, son statut et le résumé de ses lignes.
    private const string SaleSelect = $"""
        SELECT
            COUNT(*) OVER() AS {nameof(OilSaleForListResponse.Total)},

            s.id AS {nameof(OilSaleDetailsResponse.Id)},
            s.reference AS {nameof(OilSaleDetailsResponse.Reference)},
            -- date -> timestamp : Dapper ne convertit pas DateOnly en DateTime.
            s.sale_date::timestamp AS {nameof(OilSaleDetailsResponse.SaleDate)},
            s.season_id AS {nameof(OilSaleDetailsResponse.SeasonId)},
            c.id AS {nameof(OilSaleDetailsResponse.CustomerId)},
            c.name AS {nameof(OilSaleDetailsResponse.CustomerName)},
            c.reference AS {nameof(OilSaleDetailsResponse.CustomerReference)},
            c.phone AS {nameof(OilSaleDetailsResponse.CustomerPhone)},
            c.tax_id AS {nameof(OilSaleDetailsResponse.CustomerTaxId)},
            s.status_id AS {nameof(OilSaleDetailsResponse.Status)},
            st.label AS {nameof(OilSaleDetailsResponse.StatusLabel)},
            summary.tanks AS {nameof(OilSaleDetailsResponse.Tanks)},
            COALESCE(summary.quantity_liters, 0) AS {nameof(OilSaleDetailsResponse.QuantityLiters)},
            summary.quantity_kg AS {nameof(OilSaleDetailsResponse.QuantityKg)},
            s.tax_rate AS {nameof(OilSaleDetailsResponse.TaxRate)},
            s.subtotal AS {nameof(OilSaleDetailsResponse.Subtotal)},
            s.tax_amount AS {nameof(OilSaleDetailsResponse.TaxAmount)},
            s.total_amount AS {nameof(OilSaleDetailsResponse.TotalAmount)},
            COALESCE(paid.amount, 0) AS {nameof(OilSaleDetailsResponse.PaidAmount)},
            s.total_amount - COALESCE(paid.amount, 0) AS {nameof(OilSaleDetailsResponse.RemainingAmount)},
            s.delivered_at AS {nameof(OilSaleDetailsResponse.DeliveredAt)},
            s.notes AS {nameof(OilSaleDetailsResponse.Notes)},
            s.created_at AS {nameof(OilSaleDetailsResponse.CreatedAt)}

        FROM oil_sales s
        INNER JOIN customers c ON c.id = s.customer_id
        INNER JOIN oil_sale_status st ON st.id = s.status_id

        LEFT JOIN LATERAL (
            SELECT
                STRING_AGG(t.reference || ' · ' || oc.label, ', ' ORDER BY t.reference) AS tanks,
                SUM(l.quantity_liters) AS quantity_liters,
                SUM(l.quantity_kg) AS quantity_kg
            FROM oil_sale_lines l
            INNER JOIN tanks t ON t.id = l.tank_id
            INNER JOIN oil_category oc ON oc.id = l.oil_category_id
            WHERE l.oil_sale_id = s.id
        ) summary ON TRUE

        -- Encaissements de la vente.
        LEFT JOIN LATERAL (
            SELECT SUM(p.amount) AS amount
            FROM oil_sale_payments p
            WHERE p.oil_sale_id = s.id
        ) paid ON TRUE
        """;

    private const string PaymentsSql = $"""
        SELECT
            p.id AS {nameof(OilSalePaymentResponse.Id)},
            -- date -> timestamp : Dapper ne convertit pas DateOnly en DateTime.
            p.payment_date::timestamp AS {nameof(OilSalePaymentResponse.PaymentDate)},
            p.amount AS {nameof(OilSalePaymentResponse.Amount)},
            p.payment_method_id AS {nameof(OilSalePaymentResponse.PaymentMethod)},
            pm.label AS {nameof(OilSalePaymentResponse.PaymentMethodLabel)},
            p.reference AS {nameof(OilSalePaymentResponse.Reference)},
            p.notes AS {nameof(OilSalePaymentResponse.Notes)}
        FROM oil_sale_payments p
        INNER JOIN payment_method pm ON pm.id = p.payment_method_id
        WHERE p.oil_sale_id = @Id
        ORDER BY p.payment_date, p.id
        """;

    private const string LinesSql = $"""
        SELECT
            l.id AS {nameof(OilSaleLineResponse.Id)},
            l.tank_id AS {nameof(OilSaleLineResponse.TankId)},
            t.reference AS {nameof(OilSaleLineResponse.TankCode)},
            t.name AS {nameof(OilSaleLineResponse.TankName)},
            l.oil_category_id AS {nameof(OilSaleLineResponse.OilCategory)},
            oc.label AS {nameof(OilSaleLineResponse.OilCategoryLabel)},
            l.quantity_liters AS {nameof(OilSaleLineResponse.QuantityLiters)},
            l.quantity_kg AS {nameof(OilSaleLineResponse.QuantityKg)},
            l.price_unit AS {nameof(OilSaleLineResponse.PriceUnit)},
            l.unit_price AS {nameof(OilSaleLineResponse.UnitPrice)},
            l.amount AS {nameof(OilSaleLineResponse.Amount)},
            (
                SELECT STRING_AGG(m.movement_number, ', ' ORDER BY m.id)
                FROM oil_sale_line_movements lm
                INNER JOIN oil_movements m ON m.id = lm.oil_movement_id
                WHERE lm.oil_sale_line_id = l.id
            ) AS {nameof(OilSaleLineResponse.MovementNumbers)}
        FROM oil_sale_lines l
        INNER JOIN tanks t ON t.id = l.tank_id
        INNER JOIN oil_category oc ON oc.id = l.oil_category_id
        WHERE l.oil_sale_id = @Id
        ORDER BY l.id
        """;

    public OilSaleQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<PagedResult<OilSaleForListResponse>> GetOilSalesAsync(
        OilSalesRequestFilter filter,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder(SaleSelect);

        sql.Append("""

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.PageNumber - 1) * filter.PageSize);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            sql.Append("""

                AND (s.reference ILIKE @Search OR c.name ILIKE @Search)
                """);

            parameters.Add("Search", $"%{filter.Search.Trim()}%");
        }

        if (filter.CustomerId.HasValue)
        {
            sql.Append("""

                AND s.customer_id = @CustomerId
                """);

            parameters.Add("CustomerId", filter.CustomerId.Value);
        }

        if (filter.Status.HasValue)
        {
            sql.Append("""

                AND s.status_id = @Status
                """);

            parameters.Add("Status", (int)filter.Status.Value);
        }

        if (filter.FromDate.HasValue)
        {
            sql.Append("""

                AND s.sale_date >= @FromDate
                """);

            parameters.Add("FromDate", filter.FromDate.Value.Date);
        }

        if (filter.ToDate.HasValue)
        {
            sql.Append("""

                AND s.sale_date <= @ToDate
                """);

            parameters.Add("ToDate", filter.ToDate.Value.Date);
        }

        if (filter.SeasonId.HasValue)
        {
            sql.Append("""

                AND s.season_id = @SeasonId
                """);

            parameters.Add("SeasonId", filter.SeasonId.Value);
        }

        sql.Append("""

            ORDER BY s.sale_date DESC, s.id DESC

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var items = (await connection.QueryAsync<OilSaleForListResponse>(
            new CommandDefinition(sql.ToString(), parameters, cancellationToken: cancellationToken))).ToList();

        return new PagedResult<OilSaleForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = items.FirstOrDefault()?.Total ?? 0,
            Items = items
        };
    }

    public async Task<OilSaleDetailsResponse?> GetDetailsAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql = $"""
            {SaleSelect}
            WHERE s.id = @Id
            """;

        using var connection = _dbConnection;

        var sale = await connection.QuerySingleOrDefaultAsync<OilSaleDetailsResponse>(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: cancellationToken));

        if (sale is null)
        {
            return null;
        }

        sale.Lines = (await connection.QueryAsync<OilSaleLineResponse>(
            new CommandDefinition(LinesSql, new { Id = id }, cancellationToken: cancellationToken))).ToList();

        sale.Payments = (await connection.QueryAsync<OilSalePaymentResponse>(
            new CommandDefinition(PaymentsSql, new { Id = id }, cancellationToken: cancellationToken))).ToList();

        return sale;
    }
}
