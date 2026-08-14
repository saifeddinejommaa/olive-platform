using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses;

public class OlivePurchaseForDetailsResponse
{
    public int Id { get; set; }

    public string PurchaseNumber { get; set; } = null!;

    public string SupplierName { get; set; } = null!;

    public DateOnly PurchaseDate { get; set; }

    public PurchaseStatus Status { get; set; }

    public string? Notes { get; set; }

    public decimal TotalQuantityKg { get; set; }

    public decimal TotalAmount { get; set; }

    public IReadOnlyList<OlivePurchaseItemResponse> Items { get; set; }
        = [];

    public IReadOnlyList<OliveSampleSummaryResponse> Samples { get; set; }
        = [];
}

public class OlivePurchaseItemResponse
{
    public int Id { get; set; }

    public int? VarietyId { get; set; }

    public string? VarietyName { get; set; }

    public decimal AgreedQuantityKg { get; set; }

    public decimal PricePerKg { get; set; }

    public decimal TotalAmount { get; set; }
}

public class OliveSampleSummaryResponse
{
    public Guid Id { get; set; }

    public string SampleNumber { get; set; } = null!;

    public DateTimeOffset SampleDate { get; set; }

    public SampleStatus Status { get; set; }
}