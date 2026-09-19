using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.Repositories
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<List<Supplier>> GetAllAsync(CancellationToken cancellationToken = default);
    }
}
