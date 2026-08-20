using MediatR;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class CreatePressingOperationCommand : IRequest<int>
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
    : IRequestHandler<CreatePressingOperationCommand, int>
{
    private readonly IPressionOperationsRepository _repository;
    private readonly IDocumentNumberService _documentNumberService;

    public CreateProductionBatchCommandHandler(
        IPressionOperationsRepository repository,
        IDocumentNumberService documentNumberService)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
    }

    public async Task<int> Handle(
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

        var pressingOperation = new PressingOperation
        {
            OperationNumber = operationNumber,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = (ProductionStatus)request.Status,
            OilQuantityLiters = request.OilQuantityLiters,
            CreatedAt = request.CreatedAt,
            Notes = request.Notes,
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

        return pressingOperation.Id;
    }
}