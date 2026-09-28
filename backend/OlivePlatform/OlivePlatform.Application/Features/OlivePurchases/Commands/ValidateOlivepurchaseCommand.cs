using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.OlivePurchases.Commands.UpdateOlivePurchase;

public class ValidateOlivePurchaseCommand : IRequest<Unit>
{
    public int Id { get; set; }
}

public class ValidateOlivePurchaseCommandHandler
    : IRequestHandler<ValidateOlivePurchaseCommand, Unit>
{
    private readonly IOlivePurchaseRepository _repository;
    private readonly IOliveLotRepository _oliveLotRepository;
    private readonly IOliveAnalysisRepository _oliveAnalysisRepository;
    private readonly ISeasonService _seasonService;

    public ValidateOlivePurchaseCommandHandler(
        IOlivePurchaseRepository repository,
        IOliveLotRepository oliveLotRepository,
        IOliveAnalysisRepository oliveAnalysisRepository,
        ISeasonService seasonService)
    {
        _repository = repository;
        _oliveLotRepository = oliveLotRepository;
        _oliveAnalysisRepository = oliveAnalysisRepository;
        _seasonService = seasonService;
    }

    public async Task<Unit> Handle(
        ValidateOlivePurchaseCommand request,
        CancellationToken cancellationToken)
    {
        var entity =
            await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Purchase with id '{request.Id}' was not found.");

        await _seasonService.EnsureSeasonOpenAsync(
            entity.SeasonId,
            cancellationToken);

        var now = DateTime.UtcNow;

        entity.Status = PurchaseStatus.Approved;
        entity.UpdatedAt = now;

        // Achat accepté : les analyses de ses lots sont planifiées à cette date.
        var lots = await _oliveLotRepository.GetByPurchaseIdAsync(
            entity.Id,
            cancellationToken);

        foreach (var analysisId in lots
            .Where(lot => lot.OliveAnalysisId.HasValue)
            .Select(lot => lot.OliveAnalysisId!.Value)
            .Distinct())
        {
            var analysis = await _oliveAnalysisRepository.GetByIdAsync(
                analysisId,
                cancellationToken);

            if (analysis is null
                || analysis.PlannedDate is not null
                || analysis.Status != ProductionStatus.Planned)
            {
                continue;
            }

            analysis.PlannedDate = now;
            analysis.UpdatedAt = now;
        }

        // Enregistre l'achat et les analyses modifiées (même contexte).
        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}
