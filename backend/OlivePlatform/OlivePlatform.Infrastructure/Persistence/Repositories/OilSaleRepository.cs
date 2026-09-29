using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class OilSaleRepository : Repository<OilSale>, IOilSaleRepository
    {
        public OilSaleRepository(OlivePlatformAppDbContext context)
            : base(context)
        {
        }

        public async Task<OilSale?> GetWithLinesAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Include(sale => sale.Lines)
                .FirstOrDefaultAsync(sale => sale.Id == id, cancellationToken);
        }

        public async Task AddPaymentAsync(
            OilSalePayment payment,
            CancellationToken cancellationToken = default)
        {
            await Context.OilSalePayments.AddAsync(payment, cancellationToken);
        }

        public async Task AddLineMovementAsync(
            OilSaleLineMovement lineMovement,
            CancellationToken cancellationToken = default)
        {
            await Context.OilSaleLineMovements.AddAsync(lineMovement, cancellationToken);
        }
    }
}
