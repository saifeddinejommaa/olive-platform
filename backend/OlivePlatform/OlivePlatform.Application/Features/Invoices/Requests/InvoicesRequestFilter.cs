using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Invoices.Requests
{
    public class InvoicesRequestFilter : PaginationRequest
    {
        public string? InvoiceNumber { get; set; }

        public string? InvoiceType { get; set; }

        public string? SupplierName { get; set; }

        public string? CustomerName { get; set; }

        public string? Status { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }
    }
}
