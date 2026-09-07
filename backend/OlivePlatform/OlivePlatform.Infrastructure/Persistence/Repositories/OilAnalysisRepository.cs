using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class OilAnalysisRepository : IOilAnalysisRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public OilAnalysisRepository(OlivePlatformAppDbContext context)
        {
            _context = context;
        }


        public async Task AddAsync(OilAnalysis entity, CancellationToken cancellationToken = default)
        {
            await _context.OilAnalysis.AddAsync(entity, cancellationToken);
        }

        public async Task<OilAnalysis?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.OilAnalysis
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<OilAnalysis?> GetBySourceAsync(int sourceTypeId, int sourceId, CancellationToken cancellationToken = default)
        {
            return await _context.OilAnalysis.FirstOrDefaultAsync(x => x.SourceId == sourceId
                                                                      && x.SourceTypeId == (OilAnalysisSourceType)sourceTypeId, cancellationToken);
        }

        public async Task UpdateAsync(OilAnalysis entity, CancellationToken cancellationToken = default)
        {
            _context.OilAnalysis.Update(entity);
            await _context.SaveChangesAsync(
            cancellationToken);
        }
    }
}
