using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CreateOliveAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }
        public int SourceId { get; set; }

        public decimal HumidityPercentage { get; set; }
        public decimal WaterPercentage { get; set; }
        public decimal OilPercentage { get; set; }
        public decimal AcidityPercentage { get; set; }

        public DateTime AnalysisDate { get; set; }
    }

    public class CreateOliveAnalysisCommandHandler
    : IRequestHandler<CreateOliveAnalysisCommand, int>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateOliveAnalysisCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
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

            var now = DateTime.UtcNow;

            var analysis = new OliveAnalysis
            {
                SourceTypeId = request.SourceTypeId,
                SourceId = request.SourceId,
                HumidityPercentage = request.HumidityPercentage,
                WaterPercentage = request.WaterPercentage,
                OilPercentage = request.OilPercentage,
                AcidityPercentage = request.AcidityPercentage,
                AnalysisDate = request.AnalysisDate,
                CreatedAt = now,
                UpdatedAt = now
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.AddAsync(analysis, cancellationToken);
            }, cancellationToken);

            return analysis.Id;
        }
    }
}
