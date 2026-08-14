

using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class OlivePurchase
{
    public int Id { get; set; }
    public string PurchaseNumber { get; set; } = null!;

    public string SupplierName { get;  set; } = null!;

    public DateOnly PurchaseDate { get; set; }

    public PurchaseStatus? Status { get;  set; }

    public string? Notes { get;   set; }

    public ICollection<OlivePurchaseItem> Items { get;  set; }
        = new List<OlivePurchaseItem>();

    public ICollection<OliveSample> Samples { get;  set; }
        = new List<OliveSample>();

}