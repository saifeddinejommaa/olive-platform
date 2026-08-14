using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Invoices.Requests;
using OlivePlatform.Application.Features.Invoices.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.QueryRepositories;
using System.Data;
using System.Text;

namespace OlivePlatform.Infrastructure.QueryRepositories;

public class InvoiceQueryRepository : IInvoiceQueryRepository
{
    private readonly IDbConnection _dbConnection;

    public InvoiceQueryRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    // ============================================================
    // GET INVOICES - PAGINATED
    // ============================================================

    public async Task<PagedResult<InvoiceForListResponse>> GetInvoices(
        InvoicesRequestFilter filter)
    {
        var sql = new StringBuilder(
            """
            SELECT
                COUNT(*) OVER() AS Total,

                i.id AS Id,
                i.invoice_number AS InvoiceNumber,
                it.code AS InvoiceType,

                i.supplier_name AS SupplierName,
                i.customer_name AS CustomerName,
                i.invoice_date AS InvoiceDate,
                i.due_date AS DueDate,
                i.subtotal AS Subtotal,
                i.tax_amount AS TaxAmount,
                i.total_amount AS TotalAmount,

                it.id AS InvoiceType,
                ist.id AS Status

            FROM invoices i

            INNER JOIN invoice_type it
                ON it.id = i.invoice_type_id

            INNER JOIN invoice_status ist
                ON ist.id = i.status_id

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);

        // ----------------------------------------------------
        // Invoice Number
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.InvoiceNumber))
        {
            sql.Append(
                """
                
                AND i.invoice_number ILIKE @InvoiceNumber
                """);

            parameters.Add(
                "InvoiceNumber",
                $"%{filter.InvoiceNumber}%");
        }

        // ----------------------------------------------------
        // Invoice Type
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.InvoiceType))
        {
            sql.Append(
                """
                
                AND it.code = @InvoiceType
                """);

            parameters.Add(
                "InvoiceType",
                filter.InvoiceType);
        }

        // ----------------------------------------------------
        // Status
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.Status))
        {
            sql.Append(
                """
                
                AND ist.code = @Status
                """);

            parameters.Add(
                "Status",
                filter.Status);
        }

        // ----------------------------------------------------
        // Supplier
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.SupplierName))
        {
            sql.Append(
                """
                
                AND i.supplier_name ILIKE @SupplierName
                """);

            parameters.Add(
                "SupplierName",
                $"%{filter.SupplierName}%");
        }

        // ----------------------------------------------------
        // Customer
        // ----------------------------------------------------

        if (!string.IsNullOrWhiteSpace(filter.CustomerName))
        {
            sql.Append(
                """
                
                AND i.customer_name ILIKE @CustomerName
                """);

            parameters.Add(
                "CustomerName",
                $"%{filter.CustomerName}%");
        }

        // ----------------------------------------------------
        // Invoice Date From
        // ----------------------------------------------------

        if (filter.FromDate.HasValue)
        {
            sql.Append(
                """
                
                AND i.invoice_date >= @InvoiceDateFrom
                """);

            parameters.Add(
                "InvoiceDateFrom",
                filter.FromDate.Value);
        }

        // ----------------------------------------------------
        // Invoice Date To
        // ----------------------------------------------------

        if (filter.ToDate.HasValue)
        {
            sql.Append(
                """
                
                AND i.invoice_date <= @InvoiceDateTo
                """);

            parameters.Add(
                "InvoiceDateTo",
                filter.ToDate.Value);
        }

        // ----------------------------------------------------
        // Pagination
        // ----------------------------------------------------

        sql.Append(
            """
            
            ORDER BY i.invoice_date DESC, i.invoice_number

            LIMIT @PageSize
            OFFSET @Offset
            """);

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<InvoiceForListResponse>(
                sql.ToString(),
                parameters);

        var items = result.ToList();

        var total =
            items.FirstOrDefault()?.Total ?? 0;

        return new PagedResult<InvoiceForListResponse>
        {
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize,
            TotalCount = total,
            Items = items
        };
    }

    // ============================================================
    // GET INVOICE BY ID - DETAILS
    // ============================================================

    public async Task<InvoiceForDetailsResponse?> GetInvoiceById(
        int id)
    {
        const string sql =
            """
            SELECT
                i.id AS Id,
                i.invoice_number AS InvoiceNumber,

                it.id AS InvoiceTypeId,
                it.code AS InvoiceType,

                i.supplier_name AS SupplierName,
                i.customer_name AS CustomerName,
                i.invoice_date AS InvoiceDate,
                i.due_date AS DueDate,
                i.subtotal AS Subtotal,
                i.tax_amount AS TaxAmount,
                i.total_amount AS TotalAmount,

                ist.id AS StatusId,
                ist.code AS Status,

                i.notes AS Notes

            FROM invoices i

            INNER JOIN invoice_type it
                ON it.id = i.invoice_type_id

            INNER JOIN invoice_status ist
                ON ist.id = i.status_id

            WHERE i.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<InvoiceForDetailsResponse>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public async Task<Invoice?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                i.id AS Id,
                i.invoice_number AS InvoiceNumber,

                i.invoice_type_id AS InvoiceTypeId,
                i.status_id AS StatusId,

                i.supplier_name AS SupplierName,
                i.customer_name AS CustomerName,
                i.invoice_date AS InvoiceDate,
                i.due_date AS DueDate,
                i.subtotal AS Subtotal,
                i.tax_amount AS TaxAmount,
                i.total_amount AS TotalAmount,
                i.notes AS Notes,
                i.created_at AS CreatedAt,
                i.updated_at AS UpdatedAt

            FROM invoices i

            WHERE i.id = @Id
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Invoice>(
            sql,
            new
            {
                Id = id
            });
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public async Task<IReadOnlyList<Invoice>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                i.id AS Id,
                i.invoice_number AS InvoiceNumber,

                i.invoice_type_id AS InvoiceTypeId,
                i.status_id AS StatusId,

                i.supplier_name AS SupplierName,
                i.customer_name AS CustomerName,
                i.invoice_date AS InvoiceDate,
                i.due_date AS DueDate,
                i.subtotal AS Subtotal,
                i.tax_amount AS TaxAmount,
                i.total_amount AS TotalAmount,
                i.notes AS Notes,
                i.created_at AS CreatedAt,
                i.updated_at AS UpdatedAt

            FROM invoices i

            ORDER BY i.invoice_date DESC, i.invoice_number
            """;

        using var connection = _dbConnection;

        var result =
            await connection.QueryAsync<Invoice>(sql);

        return result.ToList();
    }

    // ============================================================
    // GET BY INVOICE NUMBER + TYPE
    // ============================================================

    public async Task<Invoice?> GetByInvoiceNumberAsync(
        string invoiceNumber,
        string invoiceType,
        CancellationToken cancellationToken = default)
    {
        const string sql =
            """
            SELECT
                i.id AS Id,
                i.invoice_number AS InvoiceNumber,

                i.invoice_type_id AS InvoiceTypeId,
                i.status_id AS StatusId,

                i.supplier_name AS SupplierName,
                i.customer_name AS CustomerName,
                i.invoice_date AS InvoiceDate,
                i.due_date AS DueDate,
                i.subtotal AS Subtotal,
                i.tax_amount AS TaxAmount,
                i.total_amount AS TotalAmount,
                i.notes AS Notes,
                i.created_at AS CreatedAt,
                i.updated_at AS UpdatedAt

            FROM invoices i

            INNER JOIN invoice_type it
                ON it.id = i.invoice_type_id

            WHERE i.invoice_number = @InvoiceNumber
              AND it.code = @InvoiceType
            """;

        using var connection = _dbConnection;

        return await connection.QuerySingleOrDefaultAsync<Invoice>(
            sql,
            new
            {
                InvoiceNumber = invoiceNumber,
                InvoiceType = invoiceType
            });
    }
}