using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CreateOliveAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }
        public int SourceId { get; set; }
        public DateTime? PlannedDate { get; set; }

        // Campagne sélectionnée ; doit correspondre à celle de la source.
        public int? SeasonId { get; set; }
    }

    public class CreateOliveAnalysisCommandHandler
    : IRequestHandler<CreateOliveAnalysisCommand, int>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IDocumentNumberService _documentNumberService;

        private readonly IUnitOfWork _unitOfWork;
        private readonly ISeasonService _seasonService;
        private readonly IOliveLotRepository _oliveLotRepository;

        public CreateOliveAnalysisCommandHandler(
            IOliveAnalysisRepository repository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork,
            ISeasonService seasonService,
            IOliveLotRepository oliveLotRepository)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _documentNumberService = documentNumberService;
            _seasonService = seasonService;
            _oliveLotRepository = oliveLotRepository;
        }

        public async Task<int> Handle(
            CreateOliveAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            // Récolte : l'analyse est partagée par tous ses lots. Achat : SourceId est le lot.
            var sourceType = (InputSourceType)request.SourceTypeId;

            IReadOnlyList<OliveLot> lots = sourceType == InputSourceType.Harvest
                ? await _oliveLotRepository.GetByHarvestIdAsync(request.SourceId, cancellationToken)
                : await _oliveLotRepository.GetByIdsAsync([request.SourceId], cancellationToken);

            if (lots.Count == 0)
                throw new BusinessException(
                    "Aucun lot d'olives n'est rattaché à cette source.");

            foreach (var analysisId in lots
                .Where(lot => lot.OliveAnalysisId.HasValue)
                .Select(lot => lot.OliveAnalysisId!.Value)
                .Distinct())
            {
                var existing = await _repository.GetByIdAsync(analysisId, cancellationToken);

                if (existing is not null && existing.Status != ProductionStatus.Cancelled)
                    throw new BusinessException(
                        "Une analyse d'olive existe déjà pour cette source.");
            }

            var sourceSeasonId = await _seasonService.GetSeasonIdOfSourceAsync(
                sourceType,
                request.SourceId,
                cancellationToken);

            var seasonId = await _seasonService.ResolveFromSourceAsync(
                sourceSeasonId,
                request.SeasonId,
                request.PlannedDate.HasValue
                    ? SeasonCalendar.ToBusinessDate(request.PlannedDate.Value)
                    : null,
                cancellationToken);

            var now = DateTime.UtcNow;

            var analysis = new OliveAnalysis
            {
                SeasonId = seasonId,
                Reference = string.Empty,
                PlannedDate = request.PlannedDate.ToUtc(),
                Status = ProductionStatus.Planned,
                UpdatedAt = now,
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                analysis.Reference = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OliveAnalyse,
                    DocumentPrefixes.OliveAnalyse,
                    now.Year,
                    ct);

                await _repository.AddAsync(analysis, ct);

                // Enregistrée tout de suite : son id est repris par les lots.
                await _unitOfWork.SaveChangesAsync(ct);

                foreach (var lot in lots)
                {
                    lot.OliveAnalysisId = analysis.Id;
                    lot.NeedAnalysis = true;
                    lot.UpdatedAt = now;
                }

                await _oliveLotRepository.SaveChangesAsync(ct);
            }, cancellationToken);

            return analysis.Id;
        }
    }
}
