using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
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

        public CreateOliveAnalysisCommandHandler(
            IOliveAnalysisRepository repository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork,
            ISeasonService seasonService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _documentNumberService = documentNumberService;
            _seasonService = seasonService;
        }

        public async Task<int> Handle(
            CreateOliveAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await _repository.GetBySourceAsync(
                request.SourceTypeId,
                request.SourceId,
                cancellationToken);

            if (existing != null)
                throw new InvalidOperationException(
                    "Une analyse d'olive existe déjà pour cette source.");

            var sourceSeasonId = await _seasonService.GetSeasonIdOfSourceAsync(
                (InputSourceType)request.SourceTypeId,
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

            var operationNumber = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OliveAnalyse,
                    DocumentPrefixes.OliveAnalyse,
                    now.Year);

            var analysis = new OliveAnalysis
            {
                SeasonId = seasonId,
                SourceType = (InputSourceType)request.SourceTypeId,
                SourceId = request.SourceId,
                Reference = operationNumber,
                PlannedDate = request.PlannedDate.ToUtc(),
                CreatedAt = now,
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.AddAsync(analysis, cancellationToken);
            }, cancellationToken);

            return analysis.Id;
        }
    }
}
