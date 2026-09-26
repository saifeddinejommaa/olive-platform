using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilAnalyses.Commands
{
    public class CreateOilAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }

        public int SourceId { get; set; }

        public DateTime? PlannedDate { get; set; }

        // Campagne sélectionnée ; doit correspondre à celle de la pression source.
        public int? SeasonId { get; set; }
    }

    public class CreateOilAnalysisCommandHandler
        : IRequestHandler<CreateOilAnalysisCommand, int>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOilAnalysisRepository _repository;
        private readonly IDocumentNumberService _documentNumberService;
        private readonly IPressingOperationsRepository _pressingOperationsRepository;
        private readonly ISeasonService _seasonService;

        public CreateOilAnalysisCommandHandler(
            IOilAnalysisRepository repository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork,
            IPressingOperationsRepository pressingOperationsRepository,
            ISeasonService seasonService)
        {
            _repository = repository;
            _documentNumberService = documentNumberService;
            _unitOfWork = unitOfWork;
            _pressingOperationsRepository = pressingOperationsRepository;
            _seasonService = seasonService;
        }

        public async Task<int> Handle(
            CreateOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var seasonId = await ResolveSeasonAsync(request, cancellationToken);

            var now = DateTime.UtcNow;

            var reference = await _documentNumberService.GenerateAsync(
                DocumentTypes.OilAnalysis,
                DocumentPrefixes.OilAnalysis,
                now.Year,
                cancellationToken);

            var oilAnalysis = new OilAnalysis
            {
                Reference = reference,
                SeasonId = seasonId,
                SourceTypeId = (OilAnalysisSourceType)request.SourceTypeId,
                SourceId = request.SourceId,
                PlannedDate = request.PlannedDate.ToUtc(),
                CreatedAt = now,
                Status = ProductionStatus.Planned,
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.AddAsync(oilAnalysis, cancellationToken);
            }, cancellationToken);

            return oilAnalysis.Id;
        }

        // Pression : campagne de l'opération ; cuve : campagne de la date prévue (ou du jour).
        private async Task<int> ResolveSeasonAsync(
            CreateOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            DateOnly? plannedDate = request.PlannedDate.HasValue
                ? SeasonCalendar.ToBusinessDate(request.PlannedDate.Value)
                : null;

            if ((OilAnalysisSourceType)request.SourceTypeId == OilAnalysisSourceType.PressingOperation)
            {
                var pressingOperation = await _pressingOperationsRepository.GetByIdAsync(
                    request.SourceId,
                    cancellationToken)
                    ?? throw new KeyNotFoundException(
                        $"Pressing operation {request.SourceId} not found.");

                return await _seasonService.ResolveFromSourceAsync(
                    pressingOperation.SeasonId,
                    request.SeasonId,
                    plannedDate,
                    cancellationToken);
            }

            return await _seasonService.ResolveForDateAsync(
                request.SeasonId,
                plannedDate ?? SeasonCalendar.ToBusinessDate(DateTime.UtcNow),
                cancellationToken);
        }
    }
}