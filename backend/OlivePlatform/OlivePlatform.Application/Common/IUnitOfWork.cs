namespace OlivePlatform.Application.Common
{
    public interface IUnitOfWork
    {
        Task SaveChangesAsync(
        CancellationToken cancellationToken = default);

        Task ExecuteInTransactionAsync(
            Func<CancellationToken, Task> action,
            CancellationToken cancellationToken = default);
    }
}
