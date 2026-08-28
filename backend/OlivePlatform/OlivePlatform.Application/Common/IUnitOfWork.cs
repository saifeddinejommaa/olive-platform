using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Common
{
    public interface IUnitOfWork
    {
        Task ExecuteInTransactionAsync(
            Func<CancellationToken, Task> action,
            CancellationToken cancellationToken = default);
    }
}
