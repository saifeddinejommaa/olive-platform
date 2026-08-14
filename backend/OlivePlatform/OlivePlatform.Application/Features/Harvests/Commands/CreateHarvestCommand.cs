using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.CreateHarvest;

public class CreateHarvestCommand : IRequest<int>
{
    public string HarvestNumber { get; set; } = null!;
    public int PlotId { get; set; }
    public DateOnly HarvestDate { get; set; }
    public decimal QuantityKg { get; set; }
    public string? QualityGrade { get; set; }
    public string? Notes { get; set; }
}

public class CreateHarvestCommandHandler
    : IRequestHandler<CreateHarvestCommand, int>
{
    private readonly IHarvestRepository _repository;

    public CreateHarvestCommandHandler(
        IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreateHarvestCommand request,
        CancellationToken cancellationToken)
    {
        var existing =
            await _repository.GetByNumberAsync(
                request.HarvestNumber,
                cancellationToken);

        if (existing != null)
            throw new InvalidOperationException(
                $"Harvest '{request.HarvestNumber}' already exists.");

        var entity = new Harvest
        {
            HarvestNumber = request.HarvestNumber,
            PlotId = request.PlotId,
            HarvestDate = request.HarvestDate,
            QuantityKg = request.QuantityKg,
            QualityGrade = request.QualityGrade,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);

        return entity.Id;
    }
}