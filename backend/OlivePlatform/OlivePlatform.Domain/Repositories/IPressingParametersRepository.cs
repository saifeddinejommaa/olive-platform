using OlivePlatform.Domain.Entities;

namespace OlivePlatform.Domain.Repositories
{
    public interface IPressingParametersRepository : IRepository<PressingParameters>
    {
        Task<PressingParameters?> GetByPressingOperationIdAsync(
        int pressingOperationId,
        CancellationToken cancellationToken);
    }
}
