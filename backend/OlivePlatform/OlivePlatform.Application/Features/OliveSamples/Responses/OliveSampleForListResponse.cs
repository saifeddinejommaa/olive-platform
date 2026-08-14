using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OliveSamples.Responses;

public class OliveSampleForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string SampleNumber { get; set; } = null!;

    public int? PurchaseId { get; set; }

    public string? PurchaseNumber { get; set; }

    public DateTimeOffset SampleDate { get; set; }

    public string? SupplierName { get; set; }

    public SampleStatus Status { get; set; }

    public int AnalysesCount { get; set; }
}