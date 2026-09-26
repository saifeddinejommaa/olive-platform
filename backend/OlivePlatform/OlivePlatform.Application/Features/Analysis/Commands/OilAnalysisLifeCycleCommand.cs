using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.OilAnalyses.Commands
{
    // ============================================================
    // START
    // ============================================================

    public class StartOilAnalysisCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class StartOilAnalysisCommandHandler
        : IRequestHandler<StartOilAnalysisCommand, Unit>
    {
        private readonly IOilAnalysisRepository _repository;
        private readonly ISeasonService _seasonService;

        public StartOilAnalysisCommandHandler(
            IOilAnalysisRepository repository,
            ISeasonService seasonService)
        {
            _repository = repository;
            _seasonService = seasonService;
        }

        public async Task<Unit> Handle(
            StartOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var oilAnalysis = await _repository.GetByIdAsync(request.Id, cancellationToken);

            if (oilAnalysis is null)
            {
                throw new KeyNotFoundException(
                    $"Oil analysis {request.Id} not found.");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                oilAnalysis.SeasonId,
                cancellationToken);

            oilAnalysis.CreatedAt = DateTime.SpecifyKind(
                oilAnalysis.CreatedAt,
                DateTimeKind.Utc);

            var now = DateTime.UtcNow;

            oilAnalysis.Status = ProductionStatus.InProgress;
            oilAnalysis.StartTime = now;
            oilAnalysis.UpdatedAt = now;

            await _repository.UpdateAsync(oilAnalysis, cancellationToken);

            return Unit.Value;
        }
    }

    // ============================================================
    // COMPLETE
    // ============================================================

    public class CompleteOilAnalysisCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public decimal? PeroxideIndex { get; set; }

        public decimal? K232 { get; set; }

        public decimal? K270 { get; set; }

        public int? OrganolepticGrade { get; set; }
    }

    public class CompleteOilAnalysisCommandHandler
        : IRequestHandler<CompleteOilAnalysisCommand, Unit>
    {
        private readonly IOilAnalysisRepository _repository;
        private readonly ISeasonService _seasonService;

        public CompleteOilAnalysisCommandHandler(
            IOilAnalysisRepository repository,
            ISeasonService seasonService)
        {
            _repository = repository;
            _seasonService = seasonService;
        }

        public async Task<Unit> Handle(
            CompleteOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var oilAnalysis = await _repository.GetByIdAsync(request.Id, cancellationToken);

            if (oilAnalysis is null)
            {
                throw new KeyNotFoundException(
                    $"Oil analysis {request.Id} not found.");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                oilAnalysis.SeasonId,
                cancellationToken);

            oilAnalysis.CreatedAt = DateTime.SpecifyKind(
                oilAnalysis.CreatedAt,
                DateTimeKind.Utc);

            var now = DateTime.UtcNow;

            oilAnalysis.AcidityPercentage = request.AcidityPercentage;
            oilAnalysis.PeroxideIndex = request.PeroxideIndex;
            oilAnalysis.K232 = request.K232;
            oilAnalysis.K270 = request.K270;
            oilAnalysis.OrganolepticGrade = request.OrganolepticGrade;
            oilAnalysis.Status = ProductionStatus.Completed;
            oilAnalysis.EndTime = now;
            oilAnalysis.UpdatedAt = now;

            await _repository.UpdateAsync(oilAnalysis, cancellationToken);

            return Unit.Value;
        }
    }
}