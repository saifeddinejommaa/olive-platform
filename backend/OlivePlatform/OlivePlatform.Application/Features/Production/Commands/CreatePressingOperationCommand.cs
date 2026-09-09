using MediatR;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class CreatePressingOperationCommand : IRequest<Unit>
{
    public required List<NewPressingOperationInputRequest> Inputs { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int Status { get; set; } = 0;

    public decimal? OliveQuantityKg { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public string? Notes { get; set; }
}

public class CreateProductionBatchCommandHandler
    : IRequestHandler<CreatePressingOperationCommand, Unit>
{
    private readonly IPressingOperationsRepository _repository;
    private readonly IOliveAnalysisRepository _oliveAnalysisRepository;
    private readonly IDocumentNumberService _documentNumberService;

    private const decimal OliveOilDensityKgPerLiter = 0.916m;

    public CreateProductionBatchCommandHandler(
        IPressingOperationsRepository repository,
        IDocumentNumberService documentNumberService,
        IOliveAnalysisRepository oliveAnalysisRepository)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
        _oliveAnalysisRepository = oliveAnalysisRepository;
    }

    public async Task<Unit> Handle(
        CreatePressingOperationCommand request,
        CancellationToken cancellationToken)
    {
        var year = request.CreatedAt.Year;
        var operationNumber =
           await _documentNumberService.GenerateAsync(
               DocumentTypes.Pressing,
               DocumentPrefixes.Pressing,
               year,
               cancellationToken);

        var expectedOilLiters = await CalculateExpectedOilLitersAsync(
            request.Inputs,
            cancellationToken);

        var pressingOperation = new PressingOperation
        {
            OperationNumber = operationNumber,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = (ProductionStatus)request.Status,
            OilQuantityLiters = request.OilQuantityLiters,
            CreatedAt = request.CreatedAt,
            Notes = request.Notes,
            ExpectedOilLiters = expectedOilLiters
        };

        await _repository.AddAsync(
           pressingOperation,
           cancellationToken);

        var operationId = pressingOperation.Id;

        var inputs = request.Inputs
           .Select(input => new PressingOperationInput
           {
               PressingOperationId = operationId,
               HarvestId = input.HarvestId,
               PurchaseItemId = input.PurchaseItemId,
               QuantityKg = input.QuantityKg,
               CreatedAt = request.CreatedAt,
           })
           .ToList();

        await _repository.AddInputsAsync(
            inputs,
            cancellationToken);

        return Unit.Value;
    }

    private async Task<decimal?> CalculateExpectedOilLitersAsync(
       List<NewPressingOperationInputRequest> inputs,
       CancellationToken cancellationToken)
    {
        var sources = inputs
            .Select(input => input.HarvestId is not null
                ? (SourceType: InputSourceType.Harvest, SourceId: input.HarvestId.Value)
                : (SourceType: InputSourceType.Purchase, SourceId: input.PurchaseItemId!.Value))
            .Distinct()
            .ToList();

        if (sources.Count == 0)
        {
            return null;
        }

        var analyses = new List<OliveAnalysis>();

        foreach (var source in sources)
        {
            var analysis = await _oliveAnalysisRepository.GetBySourceAsync(
                (int)source.SourceType,
                source.SourceId,
                cancellationToken);

            if (analysis is not null)
            {
                analyses.Add(analysis);
            }
        }

        decimal expectedOilKg = 0;
        var hasAnyAnalysis = false;

        foreach (var input in inputs)
        {
            var sourceType = input.HarvestId is not null
                ? InputSourceType.Harvest
                : InputSourceType.Purchase;

            var sourceId = input.HarvestId ?? input.PurchaseItemId!.Value;

            var analysis = analyses.FirstOrDefault(a =>
                a.SourceType == sourceType && a.SourceId == sourceId);

            if (analysis?.OilPercentage is null)
            {
                continue;
            }

            expectedOilKg += input.QuantityKg * (analysis.OilPercentage.Value / 100m);
            hasAnyAnalysis = true;
        }

        if (!hasAnyAnalysis)
        {
            return null;
        }

        return expectedOilKg / OliveOilDensityKgPerLiter;
    }
}