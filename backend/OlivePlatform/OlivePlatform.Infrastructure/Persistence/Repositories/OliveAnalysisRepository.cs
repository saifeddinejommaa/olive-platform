using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class OliveAnalysisRepository : IOliveAnalysisRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public OliveAnalysisRepository(OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(OliveAnalysis entity, CancellationToken cancellationToken = default)
        {
            await _context.OliveAnalysis.AddAsync(entity, cancellationToken);
        }

        public async Task<OliveAnalysis?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.OliveAnalysis
          .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<OliveAnalysis?> GetBySourceAsync(int sourceTypeId, int sourceId, CancellationToken cancellationToken = default)
        {
           return await _context.OliveAnalysis.FirstOrDefaultAsync(x => x.SourceId == sourceId
                                                                    && (int)x.SourceType ==sourceTypeId, cancellationToken);
        }

        public async Task UpdateAsync(OliveAnalysis entity, CancellationToken cancellationToken = default)
        {
            _context.OliveAnalysis.Update(entity);
            await _context.SaveChangesAsync(
             cancellationToken);
        }
    }
}
