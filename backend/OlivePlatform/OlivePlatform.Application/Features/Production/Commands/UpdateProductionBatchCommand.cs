using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class UpdateProductionBatchCommand : IRequest<bool>
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
    : IRequestHandler<UpdateProductionBatchCommand, bool>
{
    private readonly IProductionBatchRepository _repository;

    public UpdateProductionBatchCommandHandler(
        IProductionBatchRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdateProductionBatchCommand request,
        CancellationToken cancellationToken)
    {
        var productionBatch = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (productionBatch is null)
            return false;

        productionBatch.BatchNumber = request.BatchNumber;
        productionBatch.ProductionDate = request.ProductionDate;
        productionBatch.StartTime = request.StartTime;
        productionBatch.EndTime = request.EndTime;
        productionBatch.Status = (ProductionStatus)request.Status;
        productionBatch.OliveQuantityKg = request.OliveQuantityKg;
        productionBatch.OilQuantityLiters = request.OilQuantityLiters;
        productionBatch.YieldPercentage = request.YieldPercentage;
        productionBatch.Notes = request.Notes;

        await _repository.UpdateAsync(
            productionBatch,
            cancellationToken);

        return true;
    }
}