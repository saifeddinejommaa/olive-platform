using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class UpdateOliveAnalyseCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public decimal? HumidityPercentage { get; set; }

        public decimal? WaterPercentage { get; set; }

        public decimal? OilPercentage { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public DateTime? PlannedDate { get; set; }
    }

    public class UpdateOliveAnalyseCommandHandler
        : IRequestHandler<UpdateOliveAnalyseCommand, Unit>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISeasonService _seasonService;

        public UpdateOliveAnalyseCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork,
            ISeasonService seasonService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _seasonService = seasonService;
        }

        public async Task<Unit> Handle(
            UpdateOliveAnalyseCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (existing == null)
            {
                throw new InvalidOperationException(
                    "L'analyse d'olive n'existe pas.");
            }

            if (request.PlannedDate.HasValue)
            {
                await _seasonService.EnsureDateInSeasonAsync(
                    existing.SeasonId,
                    SeasonCalendar.ToBusinessDate(request.PlannedDate.Value),
                    cancellationToken);
            }
            else
            {
                await _seasonService.EnsureSeasonOpenAsync(
                    existing.SeasonId,
                    cancellationToken);
            }

            if (request.HumidityPercentage.HasValue)
            {
                existing.HumidityPercentage = request.HumidityPercentage.Value;
            }

            if (request.WaterPercentage.HasValue)
            {
                existing.WaterPercentage = request.WaterPercentage.Value;
            }

            if (request.OilPercentage.HasValue)
            {
                existing.OilPercentage = request.OilPercentage.Value;
            }

            if (request.AcidityPercentage.HasValue)
            {
                existing.AcidityPercentage = request.AcidityPercentage.Value;
            }

            if (request.PlannedDate.HasValue)
            {
                existing.PlannedDate = request.PlannedDate.Value.ToUtc();
            }

            existing.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.UpdateAsync(existing, ct);
            }, cancellationToken);

            return Unit.Value;
        }
    }
}