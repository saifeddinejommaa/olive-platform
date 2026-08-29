using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CreateOilAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }
        public int SourceId { get; set; }

        public decimal PrimaryOxidation { get; set; }
        public decimal SecondaryOxidation { get; set; }

        public DateTime AnalysisDate { get; set; }
    }

    public class CreateOilAnalysisCommandHandler
    : IRequestHandler<CreateOilAnalysisCommand, int>
    {
        private readonly IOilAnalysisRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateOilAnalysisCommandHandler(
            IOilAnalysisRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> Handle(
            CreateOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await _repository.GetBySourceAsync(
                request.SourceTypeId,
                request.SourceId,
                cancellationToken);

            if (existing != null)
                throw new InvalidOperationException(
                    "Une analyse d'huile existe déjà pour cette source.");

            var now = DateTime.UtcNow;

            var analysis = new OilAnalysis
            {
                SourceTypeId = request.SourceTypeId,
                SourceId = request.SourceId,
                PrimaryOxidation = request.PrimaryOxidation,
                SecondaryOxidation = request.SecondaryOxidation,
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
