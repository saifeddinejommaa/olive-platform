using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class CreatePressingOperationCommand : IRequest<int>
{
    public string BatchNumber { get; set; } = null!;

    public DateOnly ProductionDate { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public int Status { get; set; } = 0;

    public decimal? OliveQuantityKg { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public decimal? YieldPercentage { get; set; }

    public string? Notes { get; set; }
}

public class CreateProductionBatchCommandHandler
    : IRequestHandler<CreatePressingOperationCommand, int>
{
    private readonly IProductionBatchRepository _repository;

    public CreateProductionBatchCommandHandler(
        IProductionBatchRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreatePressingOperationCommand request,
        CancellationToken cancellationToken)
    {
        var pressingOperation = new PressingOperation
        {
            BatchNumber = request.BatchNumber,
            ProductionDate = request.ProductionDate,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = (ProductionStatus)request.Status,
            OilQuantityLiters = request.OilQuantityLiters,
            YieldPercentage = request.YieldPercentage,
            Notes = request.Notes
        };

        await _repository.AddAsync(
            pressingOperation,
            cancellationToken);

        return pressingOperation.Id;
    }
}