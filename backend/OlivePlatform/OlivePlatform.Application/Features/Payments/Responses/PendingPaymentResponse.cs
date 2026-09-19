
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Responses;

public class PendingPaymentResponse
{
    public string? RecipientName { get; set; }

    public CostLineType SourceType { get; set; }

    public int[] PaymentSources { get; set; } = [];

    public decimal AmountDue { get; set; }

    public int Total { get; set; }
}
