using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class UpdatePressingOperationCommand : IRequest<bool>
{
    public int Id { get; set; }

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

public class UpdateProductionBatchCommandHandler
    : IRequestHandler<UpdatePressingOperationCommand, bool>
{
    private readonly IProductionBatchRepository _repository;

    public UpdateProductionBatchCommandHandler(
        IProductionBatchRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdatePressingOperationCommand request,
        CancellationToken cancellationToken)
    {
        var pressingOperation = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (pressingOperation is null)
            return false;

        pressingOperation.BatchNumber = request.BatchNumber;
        pressingOperation.ProductionDate = request.ProductionDate;
        pressingOperation.StartTime = request.StartTime;
        pressingOperation.EndTime = request.EndTime;
        pressingOperation.Status = (ProductionStatus)request.Status;
        pressingOperation.OilQuantityLiters = request.OilQuantityLiters;
        pressingOperation.YieldPercentage = request.YieldPercentage;
        pressingOperation.Notes = request.Notes;

        await _repository.UpdateAsync(
            pressingOperation,
            cancellationToken);

        return true;
    }
}