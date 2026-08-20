using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPressionOperationInputsRepository
    : IRepository<PressingOperationInput>
{

    Task<PressingOperationInput> CreateAsync(PressingOperationInput input);

    Task<IReadOnlyList<PressingOperationInput>>
        GetByProductionBatchIdAsync(
            int productionBatchId,
            CancellationToken cancellationToken = default);

    Task DeleteByProductionBatchIdAsync(
        int productionBatchId,
        CancellationToken cancellationToken = default);
}