using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class PressingOperationRepository : IPressingOperationsRepository
    {
        private readonly OlivePlatformAppDbContext _context;

        public PressingOperationRepository(OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PressingOperation entity, CancellationToken cancellationToken = default)
        {
            await _context.PressingOperations.AddAsync(
             entity,
             cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task AddInputsAsync(IEnumerable<PressingOperationInput> inputs, CancellationToken cancellationToken)
        {
            await _context.PressingOperationInputs.AddRangeAsync(
             inputs,
             cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        public Task<PressingOperation?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }


        public Task UpdateAsync(PressingOperation entity, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
