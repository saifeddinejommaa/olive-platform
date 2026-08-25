using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.StartHarvest;

public class StartHarvestCommand : IRequest<Unit>
{
    public int Id { get; set; }
}

public class StartHarvestCommandHandler
    : IRequestHandler<StartHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;

    public StartHarvestCommandHandler(
        IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(
        StartHarvestCommand request,
        CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Harvest with id '{request.Id}' was not found.");
        }

        if (entity.Status != ProductionStatus.Planned)
        {
            throw new InvalidOperationException(
                "Seule une récolte planifiée peut être lancée.");
        }

        entity.Status = ProductionStatus.InProgress;
        entity.StartTime = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}