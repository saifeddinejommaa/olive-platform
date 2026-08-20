using MediatR;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class CreatePressingOperationCommand : IRequest<int>
{
    public required List<NewPressingOperationInputRequest> Inputs { get; set; }

    public required string OperationReference { get; set; }

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

    public CreateProductionBatchCommandHandler(
        IPressionOperationsRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreatePressingOperationCommand request,
        CancellationToken cancellationToken)
    {
        var pressingOperation = new PressingOperation
        {
            OperationNumber = request.OperationReference,
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