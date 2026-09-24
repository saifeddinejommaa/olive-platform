using MediatR;
using OlivePlatform.Application.Features.Production.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.ProductionBatches.Commands;

public class UpdatePressingOperationCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DateOnly? PlanificationDate { get; set; }

    public List<NewPressingOperationInputRequest>? Inputs { get; set; }

    public PressingParametersRequest? Parameters { get; set; }

    public string? Notes { get; set; }
}

public class UpdatePressingOperationCommandHandler
    : IRequestHandler<UpdatePressingOperationCommand, bool>
{
    private readonly IPressingOperationsRepository _repository;
    private readonly IPressingOperationInputsRepository _inputRepository;
    private readonly IPressingParametersRepository _parametersRepository;

    public UpdatePressingOperationCommandHandler(
        IPressingOperationsRepository repository,
        IPressingOperationInputsRepository inputRepository,
        IPressingParametersRepository parametersRepository)
    {
        _repository = repository;
        _inputRepository = inputRepository;
        _parametersRepository = parametersRepository;
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
            pressingOperation.PressingDate =
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

        if (request.Parameters is not null)
        {
            var existingParameters = await _parametersRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            if (existingParameters is null)
            {
                var newParameters = new PressingParameters
                {
                    PressingOperationId = request.Id,
                    ProcessTypeId = request.Parameters.ProcessTypeId,
                    MillId = request.Parameters.MillId,
                    MalaxingTemperatureC = request.Parameters.MalaxingTemperatureC,
                    MalaxingDurationMinutes = request.Parameters.MalaxingDurationMinutes,
                    MalaxingSpeedRpm = request.Parameters.MalaxingSpeedRpm,
                    FeedRateKgH = request.Parameters.FeedRateKgH,
                    DecanterSpeedRpm = request.Parameters.DecanterSpeedRpm,
                    DecanterDifferentialRpm = request.Parameters.DecanterDifferentialRpm,
                    CentrifugeSpeedRpm = request.Parameters.CentrifugeSpeedRpm,
                    AddedWaterLiters = request.Parameters.AddedWaterLiters,
                    WaterTemperatureC = request.Parameters.WaterTemperatureC,
                    WaitingTimeBeforeExtractionMinutes = request.Parameters.WaitingTimeBeforeExtractionMinutes,
                    Notes = request.Parameters.Notes,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _parametersRepository.AddAsync(
                    newParameters,
                    cancellationToken);
            }
            else
            {
                existingParameters.ProcessTypeId = request.Parameters.ProcessTypeId;
                existingParameters.MillId = request.Parameters.MillId;
                existingParameters.MalaxingTemperatureC = request.Parameters.MalaxingTemperatureC;
                existingParameters.MalaxingDurationMinutes = request.Parameters.MalaxingDurationMinutes;
                existingParameters.MalaxingSpeedRpm = request.Parameters.MalaxingSpeedRpm;
                existingParameters.FeedRateKgH = request.Parameters.FeedRateKgH;
                existingParameters.DecanterSpeedRpm = request.Parameters.DecanterSpeedRpm;
                existingParameters.DecanterDifferentialRpm = request.Parameters.DecanterDifferentialRpm;
                existingParameters.CentrifugeSpeedRpm = request.Parameters.CentrifugeSpeedRpm;
                existingParameters.AddedWaterLiters = request.Parameters.AddedWaterLiters;
                existingParameters.WaterTemperatureC = request.Parameters.WaterTemperatureC;
                existingParameters.WaitingTimeBeforeExtractionMinutes = request.Parameters.WaitingTimeBeforeExtractionMinutes;
                existingParameters.Notes = request.Parameters.Notes;
                existingParameters.UpdatedAt = DateTime.UtcNow;

                await _parametersRepository.UpdateAsync(
                    existingParameters,
                    cancellationToken);
            }
        }

        return true;
    }
}