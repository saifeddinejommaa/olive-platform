using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class CreatePressingOperationCommand : IRequest<Unit>
{
    public required List<NewPressingOperationInputRequest> Inputs { get; set; }

    public int Status { get; set; } = 0;

    public decimal? OliveQuantityKg { get; set; }

    public DateTime PlannedDate { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public string? Notes { get; set; }

    // Campagne sélectionnée ; si absente, déduite de PlannedDate.
    public int? SeasonId { get; set; }
}

public class CreateProductionBatchCommandHandler
    : IRequestHandler<CreatePressingOperationCommand, Unit>
{
    private readonly IPressingOperationsRepository _repository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly ISeasonService _seasonService;
    private readonly IOliveLotService _oliveLotService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductionBatchCommandHandler(
        IPressingOperationsRepository repository,
        IDocumentNumberService documentNumberService,
        ISeasonService seasonService,
        IOliveLotService oliveLotService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
        _seasonService = seasonService;
        _oliveLotService = oliveLotService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(
        CreatePressingOperationCommand request,
        CancellationToken cancellationToken)
    {
        var seasonId = await _seasonService.ResolveForDateAsync(
            request.SeasonId,
            SeasonCalendar.ToBusinessDate(request.PlannedDate),
            cancellationToken);

        var year = request.PlannedDate.Year;
        var utcNow = DateTime.UtcNow;

        // Transaction : un lot refusé annule la réservation et la création.
        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            var quantities = await _oliveLotService.ReserveAsync(
                seasonId,
                request.Inputs,
                ct);

            var operationNumber = await _documentNumberService.GenerateAsync(
                DocumentTypes.Pressing,
                DocumentPrefixes.Pressing,
                year,
                ct);

            var pressingOperation = new PressingOperation
            {
                OperationNumber = operationNumber,
                SeasonId = seasonId,
                Status = (ProductionStatus)request.Status,
                OilQuantityLiters = request.OilQuantityLiters,
                CreatedAt = utcNow,
                UpdatedAt = utcNow,
                Notes = request.Notes,
                PlannedDate = request.PlannedDate.ToUtc(),
                ExpectedOilLiters = await _oliveLotService.CalculateExpectedOilLitersAsync(
                    quantities,
                    ct)
            };

            await _repository.AddAsync(pressingOperation, ct);

            var inputs = quantities
                .Select(entry => new PressingOperationInput
                {
                    PressingOperationId = pressingOperation.Id,
                    LotId = entry.Key,
                    QuantityKg = entry.Value,
                    CreatedAt = utcNow,
                    Status = PressingOperationInputStatus.Reserved
                })
                .ToList();

            await _repository.AddInputsAsync(inputs, ct);
        }, cancellationToken);

        return Unit.Value;
    }
}
