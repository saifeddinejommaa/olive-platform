

namespace OlivePlatform.Application.Features.Harvests.Requests
{
    public class HarvestStockItemRequest
    {
        // decimal, comme la quantité de la récolte : leur somme doit être égale.
        public decimal Quantitykg { get; set; }

        public int? VarietyId { get; set; }
    }
}
