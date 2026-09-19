using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public SupplierRepository(OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(
            Supplier entity,
            CancellationToken cancellationToken = default)
        {
            await _context.Suppliers
                .AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<List<Supplier>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Suppliers
                            .AsNoTracking()
                            .ToListAsync(cancellationToken);
        }

        public async Task<Supplier?> GetByIdAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            return await _context.Suppliers
                            .AsNoTracking()
                            .FirstOrDefaultAsync(
                                x => x.Id == id,
                                cancellationToken);
        }

        public async Task UpdateAsync(
            Supplier entity,
            CancellationToken cancellationToken = default)
        {
            _context.Suppliers.Update(entity);

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}