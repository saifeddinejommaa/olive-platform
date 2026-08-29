namespace OlivePlatform.Application.Common
{
    public interface IUnitOfWork
    {
        Task ExecuteInTransactionAsync(
            Func<CancellationToken, Task> action,
            CancellationToken cancellationToken = default);
    }
}
