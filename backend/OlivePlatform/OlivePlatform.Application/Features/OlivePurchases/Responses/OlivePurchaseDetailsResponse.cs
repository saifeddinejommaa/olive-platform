using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    public class OlivePurchaseDetailsResponse
    {

        public int Id { get; set; }

        public string Reference { get; set; } = string.Empty;

        public string SupplierName { get; set; } = string.Empty;

        public DateOnly PurchaseDate { get; set; }

        public PurchaseStatus Status { get; set; }

        public string CreatedAt { get; set; } = string.Empty;

        public string? UpdatedAt { get; set; }

        public int TotalQuantity { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Notes { get; set; }

        public bool CanLaunchPression { get; set; }
        
    }
}
