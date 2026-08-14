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

    public OlivePurchase? Purchase { get; private set; }

    public ICollection<LabAnalysis> Analyses { get; private set; }
        = new List<LabAnalysis>();

    private OliveSample()
    {
    }

    public OliveSample(
        string sampleNumber,
        DateTimeOffset sampleDate,
        int? purchaseId = null)
    {
        SampleNumber = sampleNumber;
        SampleDate = sampleDate;
        PurchaseId = purchaseId;
        Status = SampleStatus.Pending;
    }

    public void MarkAsAnalyzed()
    {
        Status = SampleStatus.Analyzed;
    }

    public void Approve()
    {
        Status = SampleStatus.Approved;
    }

    public void Reject()
    {
        Status = SampleStatus.Rejected;
    }
}