using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class Repository<TEntity> : IRepository<TEntity>
    where TEntity : class
    {
        protected readonly OlivePlatformAppDbContext Context;
        protected readonly DbSet<TEntity> DbSet;

        public Repository(OlivePlatformAppDbContext context)
        {
            Context = context;
            DbSet = context.Set<TEntity>();
        }

        public async Task<TEntity?> GetByIdAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            return await DbSet.FindAsync(
                new object[] { id },
                cancellationToken);
        }

        public async Task AddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default)
        {
            await DbSet.AddAsync(entity, cancellationToken);
        }

        public async Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            DbSet.Update(entity);
        }

        public void Delete(TEntity entity)
        {
            DbSet.Remove(entity);
        }
    }
}
