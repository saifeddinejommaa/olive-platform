using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses;

public class OlivePurchaseForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string PurchaseNumber { get; set; } = null!;

    public string SupplierName { get; set; } = null!;

    public DateOnly PurchaseDate { get; set; }

    public PurchaseStatus Status { get; set; }

    public decimal TotalQuantityKg { get; set; }

    public decimal TotalAmount { get; set; }

    public int ItemsCount { get; set; }
}