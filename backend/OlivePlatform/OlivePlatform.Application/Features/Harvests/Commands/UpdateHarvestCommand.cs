using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;

public class UpdateHarvestCommand : IRequest
{
    public int Id { get; set; }
    public string HarvestNumber { get; set; } = null!;
    public int PlotId { get; set; }
    public DateOnly HarvestDate { get; set; }
    public decimal QuantityKg { get; set; }
    public string? QualityGrade { get; set; }
    public string? Notes { get; set; }
}

public class UpdateHarvestCommandHandler
    : IRequestHandler<UpdateHarvestCommand>
{
    private readonly IHarvestRepository _repository;

    public UpdateHarvestCommandHandler(
        IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        UpdateHarvestCommand request,
        CancellationToken cancellationToken)
    {
        var entity =
            await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Harvest with id '{request.Id}' was not found.");

        entity.HarvestNumber = request.HarvestNumber;
        entity.PlotId = request.PlotId;
        entity.HarvestDate = request.HarvestDate;
        entity.QuantityKg = request.QuantityKg;
        entity.QualityGrade = request.QualityGrade;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);
    }
}