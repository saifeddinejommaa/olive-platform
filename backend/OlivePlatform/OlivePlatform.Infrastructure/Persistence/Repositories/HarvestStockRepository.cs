using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class HarvestStockRepository : IHarvestStockRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public HarvestStockRepository(
            OlivePlatformAppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(HarvestStock entity, CancellationToken cancellationToken = default)
        {
            await _context.HarvestStocks.AddAsync(
          entity,
          cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public Task<HarvestStock?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(HarvestStock entity, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
