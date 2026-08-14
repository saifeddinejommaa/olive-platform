namespace OlivePlatform.Domain.Repositories
{
    public interface IRepository<TEntity>
    where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(
            int id,
            CancellationToken cancellationToken = default);

        Task AddAsync(
            TEntity entity,
            CancellationToken cancellationToken = default);

        Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    }
}
