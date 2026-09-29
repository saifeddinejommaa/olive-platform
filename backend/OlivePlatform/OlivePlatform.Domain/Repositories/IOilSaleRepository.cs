using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IOilSaleRepository : IRepository<OilSale>
{
    // Vente avec ses lignes.
    Task<OilSale?> GetWithLinesAsync(
        int id,
        CancellationToken cancellationToken = default);

    // Encaissement d'une vente.
    Task AddPaymentAsync(
        OilSalePayment payment,
        CancellationToken cancellationToken = default);

    // Rattache un mouvement « Sortie vente » à sa ligne de vente.
    Task AddLineMovementAsync(
        OilSaleLineMovement lineMovement,
        CancellationToken cancellationToken = default);
}
