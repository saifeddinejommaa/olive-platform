using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class FinancialPaymentRepository : IFinancialPaymentRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public FinancialPaymentRepository(
            OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(FinancialPayment entity, CancellationToken cancellationToken = default)
        {
            await _context.FinancialPayment.AddAsync(
                            entity,
                            cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<FinancialPayment?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.FinancialPayment
                            .FirstOrDefaultAsync(
                                x => x.Id == id,
                                cancellationToken);
        }

        public async Task UpdateAsync(FinancialPayment entity, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
