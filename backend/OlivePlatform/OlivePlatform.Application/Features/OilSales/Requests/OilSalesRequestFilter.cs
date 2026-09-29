using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OilSales.Requests;

public class OilSalesRequestFilter : PaginationRequest
{
    // Référence de vente ou nom du client.
    public string? Search { get; set; }

    public int? CustomerId { get; set; }

    public OilSaleStatus? Status { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public int? SeasonId { get; set; }
}
