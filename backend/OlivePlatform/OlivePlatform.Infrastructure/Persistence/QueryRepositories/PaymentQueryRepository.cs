using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Payments.Requests;
using OlivePlatform.Application.Features.Payments.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class PaymentQueryRepository : IPaymentQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public PaymentQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET PAYMENTS - PAGINATED
    // ============================================================

    public async Task<PagedResult<PaymentForListResponse>> GetPayments(
        PaymentsRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                p.id AS Id,
                p.payment_number AS PaymentNumber,

                p.payment_date AS PaymentDate,

                p.amount AS Amount,

                pm.id AS PaymentMethod,

                p.invoice_id AS InvoiceId,

                i.invoice_number AS InvoiceNumber,

                p.supplier_name AS SupplierName,

                p.worker_name AS WorkerName,

                p.reference AS Reference

            FROM payments p

            INNER JOIN payment_method pm
                ON pm.id = p.payment_method_id

            LEFT JOIN invoices i
                ON i.id = p.invoice_id

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ========================================================
        // Payment Number
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.PaymentNumber))
        {
            sql.Append(
                """

                AND p.payment_number ILIKE @PaymentNumber
                """);

            parameters.Add(
                "PaymentNumber",
                $"%{filter.PaymentNumber}%");
        }

        // ========================================================
        // Invoice
        // ========================================================

        if (filter.InvoiceId.HasValue)
        {
            sql.Append(
                """

                AND p.invoice_id = @InvoiceId
                """);

            parameters.Add(
                "InvoiceId",
                filter.InvoiceId.Value);
        }

        // ========================================================
        // Payment Method
        // ========================================================

        if (filter.PaymentMethod.HasValue)
        {
            sql.Append(
                """

                AND p.payment_method_id = @PaymentMethod
                """);

            parameters.Add(
                "PaymentMethod",
                (int)filter.PaymentMethod.Value);
        }

        // ========================================================
        // From Date
        // ========================================================

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """

                AND p.payment_date >= @FromDate
                """);

            parameters.Add(
                "FromDate",
                filter.FromDate.Value);
        }

        // ========================================================
        // To Date
        // ========================================================

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """

                AND p.payment_date <= @ToDate
                """);

            parameters.Add(
                "ToDate",
                filter.ToDate.Value);
        }

        // ========================================================
        // Pagination
        // ========================================================

        sql.Append(
            """

            ORDER BY
                p.payment_date DESC,
                p.payment_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<PaymentForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<PaymentForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<Payment?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                p.id AS Id,

                p.payment_number AS PaymentNumber,

                p.payment_date AS PaymentDate,

                p.amount AS Amount,

                p.payment_method_id AS PaymentMethodId,

                p.invoice_id AS InvoiceId,

                p.supplier_name AS SupplierName,

                p.worker_name AS WorkerName,

                p.reference AS Reference,

                p.notes AS Notes,

                p.created_at AS CreatedAt

            FROM payments p

            WHERE p.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Payment>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Payment>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                p.id AS Id,

                p.payment_number AS PaymentNumber,

                p.payment_date AS PaymentDate,

                p.amount AS Amount,

                p.payment_method_id AS PaymentMethodId,

                p.invoice_id AS InvoiceId,

                p.supplier_name AS SupplierName,

                p.worker_name AS WorkerName,

                p.reference AS Reference,

                p.notes AS Notes,

                p.created_at AS CreatedAt

            FROM payments p

            ORDER BY
                p.payment_date DESC,
                p.payment_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Payment>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY INVOICE ID
    // ============================================================

    public async Task<IReadOnlyList<Payment>> GetByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                p.id AS Id,

                p.payment_number AS PaymentNumber,

                p.payment_date AS PaymentDate,

                p.amount AS Amount,

                p.payment_method_id AS PaymentMethodId,

                p.invoice_id AS InvoiceId,

                p.supplier_name AS SupplierName,

                p.worker_name AS WorkerName,

                p.reference AS Reference,

                p.notes AS Notes,

                p.created_at AS CreatedAt

            FROM payments p

            WHERE p.invoice_id = @InvoiceId

            ORDER BY
                p.payment_date DESC,
                p.payment_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Payment>(
                sql,
                new
                {
                    InvoiceId = invoiceId
                });

        return result.ToList();
    }
}