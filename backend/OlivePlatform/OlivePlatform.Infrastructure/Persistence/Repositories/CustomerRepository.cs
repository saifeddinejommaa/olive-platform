using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Infrastructure.Persistence.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(OlivePlatformAppDbContext context)
            : base(context)
        {
        }

        public async Task<bool> ExistsByNameAsync(
            string name,
            int? excludeId = null,
            CancellationToken cancellationToken = default)
        {
            var normalized = name.Trim().ToLower();

            return await DbSet.AnyAsync(
                customer => customer.Name.ToLower() == normalized
                    && (excludeId == null || customer.Id != excludeId),
                cancellationToken);
        }
    }
}
