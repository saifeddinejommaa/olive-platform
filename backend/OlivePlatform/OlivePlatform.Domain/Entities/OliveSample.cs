using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class OliveSample
{
    public int Id { get; set; }
    public string SampleNumber { get; private set; } = null!;

    public int? PurchaseId { get; private set; }

    public DateTimeOffset SampleDate { get; private set; }

    public decimal? QuantityKg { get; private set; }

    public string? SupplierName { get; private set; }

    public SampleStatus Status { get; private set; }

    public string? Notes { get; private set; }
}