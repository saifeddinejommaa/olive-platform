using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;

public class UpdateHarvestCommand : IRequest<Unit>
{
    public int Id { get; set; }

    public int? PlannedTrees { get; set; }

    public int? HarvestedTrees { get; set; }

    public decimal? QuantityKg { get; set; }

    public DateOnly? HarvestDate { get; set; }

    public DateTime? StartTime { get; set; }

    public string? Notes { get; set; }
}

public class UpdateHarvestCommandHandler
    : IRequestHandler<UpdateHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;

    public UpdateHarvestCommandHandler(
        IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(
        UpdateHarvestCommand request,
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

        if (request.PlannedTrees.HasValue)
        {
            if (request.PlannedTrees.Value < 0)
            {
                throw new ArgumentException(
                    "Planned trees cannot be negative.");
            }

            entity.PlannedTrees = request.PlannedTrees.Value;
        }

        if (request.HarvestedTrees.HasValue)
        {
            if (request.HarvestedTrees.Value < 0)
            {
                throw new ArgumentException(
                    "Harvested trees cannot be negative.");
            }

            entity.HarvestedTrees = request.HarvestedTrees.Value;
        }

        if (request.QuantityKg.HasValue)
        {
            if (request.QuantityKg.Value < 0)
            {
                throw new ArgumentException(
                    "Quantity cannot be negative.");
            }

            entity.QuantityKg = request.QuantityKg.Value;
        }

        if (request.HarvestDate.HasValue)
        {
            entity.HarvestDate = request.HarvestDate.Value;
        }

        if (request.StartTime.HasValue)
        {
            entity.StartTime = request.StartTime.Value;
        }

        if (request.Notes != null)
        {
            entity.Notes = request.Notes;
        }

        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}