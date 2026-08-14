using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OlivePurchases.Requests
{
    public class OlivePurchasesRequestFilter : PaginationRequest
    {
        public string? PurchaseNumber { get; set; }

        public string? SupplierName { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }

        public PurchaseStatus? Status { get; set; }
    }
}
