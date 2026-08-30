using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CompleteOliveAnalyseCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public decimal? HumidityPercentage { get; set; }

        public decimal? WaterPercentage { get; set; }

        public decimal? OilPercentage { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public DateTime? AnalysisDate { get; set; }
    }

    public class CompleteOliveAnalyseCommandHandler
        : IRequestHandler<CompleteOliveAnalyseCommand, Unit>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public CompleteOliveAnalyseCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
            CompleteOliveAnalyseCommand request,
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

            if (request.AnalysisDate.HasValue)
            {
                existing.AnalysisDate = request.AnalysisDate.Value;
            }

            existing.UpdatedAt = DateTime.UtcNow;
            existing.Status = ProductionStatus.Completed;

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.UpdateAsync(existing, ct);
            }, cancellationToken);

            return Unit.Value;
        }
    }
}