using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Payments.Responses;

public class PendingPaymentCostLineDetailResponse
{
    public int SourceId { get; set; }

    public required string SourceReference { get; set; }

    public int CostLineType { get; set; }

    public DateOnly OperationDate { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal AmountDue { get; set; }

    public string? Notes { get; set; }
}

