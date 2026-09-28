namespace OlivePlatform.Application.Features.Production.Requests
{
    public class NewPressingOperationInputRequest
    {
        // Lot d'olives pressé (récolte ou achat).
        public long LotId { get; set; }

        // Quantité prélevée ; absente = tout le restant du lot.
        public decimal? QuantityKg { get; set; }
    }
}
