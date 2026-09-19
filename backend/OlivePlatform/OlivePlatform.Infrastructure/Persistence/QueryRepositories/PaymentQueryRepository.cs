using Dapper;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Payments.Requests;
using OlivePlatform.Application.Features.Payments.Responses;
using OlivePlatform.Domain.Enums;
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

    public async Task<PagedResult<PendingPaymentResponse>> GetPendingPayments(
        PendingPaymentFilter filter,
        CancellationToken cancellationToken = default)
    {
        var sql = new StringBuilder($"""
            WITH pending_payments AS
            (
                -- ========================================================
                -- MAIN D'OEUVRE
                -- ========================================================
                SELECT
                    hcl.worker_name AS "RecipientName",

                    1 AS "SourceType",

                    ARRAY_AGG(
                        hcl.id::integer
                        ORDER BY hcl.id
                    ) AS "PaymentSources",

                    SUM(hcl.unpaid_amount) AS "AmountDue"

                FROM public.harvest_cost_line hcl

                WHERE hcl.type_id = 1
                  AND hcl.unpaid_amount > 0

                GROUP BY
                    hcl.worker_name,
                    hcl.worker_identifier


                UNION ALL


                -- ========================================================
                -- TRANSPORT
                -- ========================================================
                SELECT
                    hcl.worker_name AS "RecipientName",

                    2 AS "SourceType",

                    ARRAY_AGG(
                        hcl.id::integer
                        ORDER BY hcl.id
                    ) AS "PaymentSources",

                    SUM(hcl.unpaid_amount) AS "AmountDue"

                FROM public.harvest_cost_line hcl

                WHERE hcl.type_id = 2
                  AND hcl.unpaid_amount > 0

                GROUP BY
                    hcl.worker_name,
                    hcl.worker_identifier


                UNION ALL


                -- ========================================================
                -- ACHAT D'OLIVES
                -- ========================================================
                SELECT
                    s.name AS "RecipientName",

                    7 AS "SourceType",

                    ARRAY_AGG(
                        op.id::integer
                        ORDER BY op.id
                    ) AS "PaymentSources",

                    SUM(op.unpaid_amount) AS "AmountDue"

                FROM public.olive_purchases op

                INNER JOIN public.supplier s
                    ON s.id = op.supplier_id

                WHERE op.unpaid_amount > 0

                GROUP BY
                    s.id,
                    s.name
            )

            SELECT
                COUNT(*) OVER() AS {nameof(PendingPaymentResponse.Total)},

                p."RecipientName"
                    AS {nameof(PendingPaymentResponse.RecipientName)},

                p."SourceType"
                    AS {nameof(PendingPaymentResponse.SourceType)},

                p."PaymentSources"
                    AS {nameof(PendingPaymentResponse.PaymentSources)},

                p."AmountDue"
                    AS {nameof(PendingPaymentResponse.AmountDue)}

            FROM pending_payments p

            WHERE 1 = 1
            """);

        var parameters = new DynamicParameters();

        // ========================================================
        // Pagination
        // ========================================================

        parameters.Add(
            "PageSize",
            filter.PageSize);

        parameters.Add(
            "Offset",
            (filter.PageNumber - 1) * filter.PageSize);


        // ========================================================
        // Recipient
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.RecipientName))
        {
            sql.Append("""
                
                AND p."RecipientName" ILIKE @RecipientName
                """);

            parameters.Add(
                "RecipientName",
                $"%{filter.RecipientName}%");
        }


        // ========================================================
        // Cost Type
        // ========================================================

        if (filter.CostType.HasValue)
        {
            sql.Append("""
                
                AND p."SourceType" = @CostType
                """);

            parameters.Add(
                "CostType",
                (int)filter.CostType.Value);
        }


        // ========================================================
        // Montant minimum
        // ========================================================

        if (filter.MinAmount.HasValue)
        {
            sql.Append("""
                
                AND p."AmountDue" >= @MinAmount
                """);

            parameters.Add(
                "MinAmount",
                filter.MinAmount.Value);
        }


        // ========================================================
        // Montant maximum
        // ========================================================

        if (filter.MaxAmount.HasValue)
        {
            sql.Append("""
                
                AND p."AmountDue" <= @MaxAmount
                """);

            parameters.Add(
                "MaxAmount",
                filter.MaxAmount.Value);
        }


        // ========================================================
        // Pagination SQL
        // ========================================================

        sql.Append("""
            
            ORDER BY
                p."RecipientName",
                p."SourceType"

            LIMIT @PageSize
            OFFSET @Offset
            """);


        // ========================================================
        // Exécution
        // ========================================================

        using var connection = _dbConnection;

        var result = await connection.QueryAsync<PendingPaymentResponse>(
            new CommandDefinition(
                sql.ToString(),
                parameters,
                cancellationToken: cancellationToken));

        var items = result.AsList();


        // ========================================================
        // Total
        // ========================================================

        var total = items.FirstOrDefault()?.Total ?? 0;


        // ========================================================
        // Résultat paginé
        // ========================================================

        return new PagedResult<PendingPaymentResponse>
        {
            Items = items,
            TotalCount = total,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }


    public async Task<PagedResult<ProcessedPaymentResponse>> GetPaymentHistory(
    PaymentHistoryFilter filter,
    CancellationToken cancellationToken = default)
    {
        var parameters = new DynamicParameters();

        var where = new StringBuilder();

        // ========================================================
        // Recipient
        // ========================================================

        if (!string.IsNullOrWhiteSpace(filter.RecipientName))
        {
            where.Append("""
            AND recipient_name ILIKE @RecipientName
            """);

            parameters.Add(
                "RecipientName",
                $"%{filter.RecipientName}%");
        }

        // ========================================================
        // Date début
        // ========================================================

        if (filter.PaymentDateFrom.HasValue)
        {
            where.Append("""
            AND payment_date >= @PaymentDateFrom
            """);

            parameters.Add(
                "PaymentDateFrom",
                filter.PaymentDateFrom.Value);
        }

        // ========================================================
        // Date fin
        // ========================================================

        if (filter.PaymentDateTo.HasValue)
        {
            where.Append("""
            AND payment_date <= @PaymentDateTo
            """);

            parameters.Add(
                "PaymentDateTo",
                filter.PaymentDateTo.Value);
        }

        // ========================================================
        // Pagination
        // ========================================================

        var offset =
            (filter.PageNumber - 1) * filter.PageSize;

        parameters.Add("Offset", offset);
        parameters.Add("PageSize", filter.PageSize);

        // ========================================================
        // SQL
        // ========================================================

        var sql = $"""
        WITH payment_history AS
        (
            SELECT
                fp.id AS {nameof(ProcessedPaymentResponse.Id)},

                fp.payment_date
                    AS {nameof(ProcessedPaymentResponse.PaymentDate)},

                recipient.recipient_name
                    AS {nameof(ProcessedPaymentResponse.RecipientName)},

                fp.amount
                    AS {nameof(ProcessedPaymentResponse.Amount)},

                fp.payment_method_id
                    AS {nameof(ProcessedPaymentResponse.paymentMethod)},

                fp.notes
                    AS {nameof(ProcessedPaymentResponse.Notes)},

                fp.created_at
                    AS {nameof(ProcessedPaymentResponse.CreatedAt)}

            FROM public.financial_payment fp

            LEFT JOIN LATERAL
            (
                SELECT
                    STRING_AGG(
                        DISTINCT recipients.recipient_name,
                        ', '
                    ) AS recipient_name

                FROM
                (
                    -- ====================================================
                    -- Harvest Cost Lines
                    -- ====================================================

                    SELECT
                        hcl.worker_name AS recipient_name

                    FROM public.financial_payment_source fps

                    INNER JOIN public.harvest_cost_line hcl
                        ON hcl.id = fps.source_id

                    WHERE fps.financial_payment_id = fp.id
                      AND fps.source_type_id != {(int)CostLineType.olivePurchase}

                    UNION

                    -- ====================================================
                    -- Olive Purchases
                    -- ====================================================

                    SELECT
                        s.name AS recipient_name

                    FROM public.financial_payment_source fps

                    INNER JOIN public.olive_purchases op
                        ON op.id = fps.source_id

                    INNER JOIN public.supplier s
                        ON s.id = op.supplier_id

                    WHERE fps.financial_payment_id = fp.id
                      AND fps.source_type_id = 7

                ) recipients
            ) recipient
                ON TRUE
        )

        SELECT
            *,
            COUNT(*) OVER()
                AS {nameof(ProcessedPaymentResponse.Total)}

        FROM payment_history

        WHERE 1 = 1

        {where}

        ORDER BY
            PaymentDate DESC

        OFFSET @Offset
        LIMIT @PageSize;
        """;

        using var connection = _dbConnection;

        var items =
            (
                await connection.QueryAsync<ProcessedPaymentResponse>(
                    new CommandDefinition(
                        sql,
                        parameters,
                        cancellationToken: cancellationToken))
            ).AsList();

        var totalCount = items.Count > 0
            ? items[0].Total
            : 0;

        return new PagedResult<ProcessedPaymentResponse>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }

    public async Task<PendingPaymentDetailsResponse> GetPendingPaymentDetails(
    GetPendingPaymentDetailsRequest request,
    CancellationToken cancellationToken = default)
    {
        var response = new PendingPaymentDetailsResponse
        {
            Type = request.SourceType,
            Details = []
        };

        if (request.SourceIds == null || request.SourceIds.Length == 0)
        {
            return response;
        }

        var parameters = new DynamicParameters();

        parameters.Add(
            "SourceIds",
            request.SourceIds);

        using var connection = _dbConnection;

        /*
         * Main d'oeuvre / Transport
         */
        if (request.SourceType == CostLineType.MainOeuvre ||
            request.SourceType == CostLineType.Transport)
        {
            parameters.Add(
                "SourceType",
                (int)request.SourceType);

            var sql = $"""
            SELECT
                hcl.id AS {nameof(PendingPaymentCostLineDetailResponse.SourceId)},
                h.reference AS {nameof(PendingPaymentCostLineDetailResponse.SourceReference)},
                hcl.type_id AS {nameof(PendingPaymentCostLineDetailResponse.CostLineType)},
                hcl.date AS {nameof(PendingPaymentCostLineDetailResponse.OperationDate)},
                hcl.total_amount AS {nameof(PendingPaymentCostLineDetailResponse.TotalAmount)},
                hcl.unpaid_amount AS {nameof(PendingPaymentCostLineDetailResponse.AmountDue)},
                hcl.notes AS {nameof(PendingPaymentCostLineDetailResponse.Notes)}
            FROM public.harvest_cost_line hcl
                INNER JOIN public.harvests h
                    ON h.id = hcl.harvest_id
            WHERE hcl.id = ANY(@SourceIds)
              AND hcl.type_id = @SourceType
            ORDER BY hcl.date DESC, hcl.id DESC;
            """;

            var details =
                await connection.QueryAsync<PendingPaymentCostLineDetailResponse>(
                    new CommandDefinition(
                        sql,
                        parameters,
                        cancellationToken: cancellationToken));

            response.Details = details.AsList();

            return response;
        }

        /*
         * Achat d'olives
         */
        if (request.SourceType == CostLineType.olivePurchase)
        {
            var sql = $"""
            SELECT
                op.id AS {nameof(PendingPaymentCostLineDetailResponse.SourceId)},
                op.reference AS {nameof(PendingPaymentCostLineDetailResponse.SourceReference)},
                @SourceType AS {nameof(PendingPaymentCostLineDetailResponse.CostLineType)},
                op.purchase_date AS {nameof(PendingPaymentCostLineDetailResponse.OperationDate)},
            
                COALESCE(
                    SUM(
                        opi.agreed_quantity_kg * opi.price_per_kg
                    ),
                    0
                ) AS {nameof(PendingPaymentCostLineDetailResponse.TotalAmount)},
            
                op.unpaid_amount AS {nameof(PendingPaymentCostLineDetailResponse.AmountDue)},
            
                op.notes AS {nameof(PendingPaymentCostLineDetailResponse.Notes)}
            
            FROM public.olive_purchases op
            
            LEFT JOIN public.olive_purchase_items opi
                ON opi.purchase_id = op.id
            
            WHERE op.id = ANY(@SourceIds)
            
            GROUP BY
                op.id,
                op.reference,
                op.purchase_date,
                op.unpaid_amount,
                op.notes
            
            ORDER BY
                op.purchase_date DESC,
                op.id DESC;
            """;

            parameters.Add(
                "SourceType",
                (int)request.SourceType);

            var details =
                await connection.QueryAsync<PendingPaymentCostLineDetailResponse>(
                    new CommandDefinition(
                        sql,
                        parameters,
                        cancellationToken: cancellationToken));

            response.Details = details.AsList();

            return response;
        }

        return response;
    }

}

