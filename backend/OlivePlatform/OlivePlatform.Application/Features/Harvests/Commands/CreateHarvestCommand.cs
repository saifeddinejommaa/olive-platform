using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
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
    public DateTime PlannedDate { get; set; }
    public HarvestType HarvestType { get; set; }
    public int PlannedTrees { get; set; }
    public string? Notes { get; set; }

    // Campagne sélectionnée ; si absente, déduite de PlannedDate.
    public int? SeasonId { get; set; }
}

public class CreateHarvestCommandHandler : IRequestHandler<CreateHarvestCommand, int>
{
    private readonly IHarvestRepository _repository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly ISeasonService _seasonService;

    public CreateHarvestCommandHandler(IHarvestRepository repository,
        IDocumentNumberService documentNumberService,
        ISeasonService seasonService)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
        _seasonService = seasonService;
    }

    public async Task<int> Handle(CreateHarvestCommand request, CancellationToken cancellationToken)
    {
        var seasonId = await _seasonService.ResolveForDateAsync(
            request.SeasonId,
            SeasonCalendar.ToBusinessDate(request.PlannedDate),
            cancellationToken);

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
            SeasonId = seasonId,
            PlotId = request.PlotId,
            PlannedDate = request.PlannedDate.ToUtc(),
            Status = ProductionStatus.Planned,
            Notes = request.Notes,
            VarietyId = request.VarietyId,
            StartTime = null,
            EndTime = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PlannedTrees = request.PlannedTrees,
            HarvestType = request.HarvestType
        };

        await _repository.AddAsync(entity, cancellationToken);

        return entity.Id;
    }
}