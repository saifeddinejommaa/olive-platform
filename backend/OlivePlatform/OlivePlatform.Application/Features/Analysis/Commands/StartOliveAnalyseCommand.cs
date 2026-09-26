using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class StartOliveAnalyseCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class StartOliveAnalyseCommandHandler
   : IRequestHandler<StartOliveAnalyseCommand, Unit>
    {
        private readonly IOliveAnalysisRepository _repository;

        private readonly IUnitOfWork _unitOfWork;
        private readonly ISeasonService _seasonService;

        public StartOliveAnalyseCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork,
            ISeasonService seasonService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _seasonService = seasonService;
        }

        public async Task<Unit> Handle(StartOliveAnalyseCommand request, CancellationToken cancellationToken)
        {
            var existing = await _repository.GetByIdAsync(
               request.Id,
                cancellationToken);

            if (existing == null)
            {
                throw new InvalidOperationException(
                    "Pas d'opération d'analyse à lancer");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                existing.SeasonId,
                cancellationToken);

            var now = DateTime.UtcNow;

            existing.Status = ProductionStatus.InProgress;
            existing.UpdatedAt = now;
            existing.StartTime = now;

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.UpdateAsync(existing, cancellationToken);
            }, cancellationToken);

            return Unit.Value;
        }
    }
}
