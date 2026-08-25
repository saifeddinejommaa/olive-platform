using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Harvests.Commands.CreateHarvest;

public class CreateHarvestCommand : IRequest<int>
{
    public int PlotId { get; set; }
    public int VarietyId { get; set; }
    public DateOnly HarvestDate { get; set; }
    public DateTime? StartTime { get; set; }
    public ProductionStatus Status { get; set; }
    public int PlannedTrees { get; set; }
    public string? Notes { get; set; }
}

public class CreateHarvestCommandHandler : IRequestHandler<CreateHarvestCommand, int>
{
    private readonly IHarvestRepository _repository;
    private readonly IDocumentNumberService _documentNumberService;

    public CreateHarvestCommandHandler(IHarvestRepository repository,
        IDocumentNumberService documentNumberService)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
    }

    public async Task<int> Handle(CreateHarvestCommand request, CancellationToken cancellationToken)
    {
        DateTime now = DateTime.Now;
        var year = now.Year;
        var operationNumber =
           await _documentNumberService.GenerateAsync(
               DocumentTypes.Harvest,
               DocumentPrefixes.Harvest,
               year,
               cancellationToken);

        var entity = new Harvest
        {
            Reference = operationNumber,
            PlotId = request.PlotId,
            HarvestDate = request.HarvestDate,
            Status = request.Status,
            Notes = request.Notes,
            VarietyId = request.VarietyId,
            StartTime = null,
            EndTime = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PlannedTrees = request.PlannedTrees
            
        };

        await _repository.AddAsync(entity, cancellationToken);

        return entity.Id;
    }
}