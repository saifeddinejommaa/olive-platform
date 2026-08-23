using MediatR;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class UpdatePressingOperationCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DateTime? PlanificationDate { get; set; }

    public List<NewPressingOperationInputRequest>? Inputs { get; set; }

    public string? Notes { get; set; }
}

public class UpdatePressingOperationCommandHandler
    : IRequestHandler<UpdatePressingOperationCommand, bool>
{
    private readonly IPressingOperationsRepository _repository;
    private readonly IPressingOperationInputsRepository _inputRepository;

    public UpdatePressingOperationCommandHandler(
        IPressingOperationsRepository repository,
        IPressingOperationInputsRepository inputRepository)
    {
        _repository = repository;
        _inputRepository = inputRepository;
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

        if (request.PlanificationDate.HasValue)
        {
            pressingOperation.CreatedAt =
                request.PlanificationDate.Value;
        }

        if (request.Notes is not null)
        {
            pressingOperation.Notes = request.Notes;
        }

        await _repository.UpdateAsync(
            pressingOperation,
            cancellationToken);

        // Si Inputs est fourni, on remplace complètement les inputs existants.
        if (request.Inputs is not null)
        {
            await _inputRepository.DeleteByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            var inputs = request.Inputs
            .Select(input => new PressingOperationInput
            {
                PressingOperationId = request.Id,
                HarvestId = input.HarvestId,
                PurchaseItemId = input.PurchaseItemId,
                QuantityKg = input.QuantityKg,
                CreatedAt = DateTime.UtcNow
            })
            .ToList();

            if (inputs.Count > 0)
            {
                await _repository.AddInputsAsync(
                    inputs,
                    cancellationToken);
            }
        }

        return true;
    }
}