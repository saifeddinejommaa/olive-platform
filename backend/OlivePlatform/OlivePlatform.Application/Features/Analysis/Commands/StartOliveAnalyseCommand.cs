using MediatR;
using OlivePlatform.Application.Common;
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

        public StartOliveAnalyseCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
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

            existing.Status = ProductionStatus.InProgress;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.AnalysisDate = DateTime.UtcNow;

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.UpdateAsync(existing, cancellationToken);
            }, cancellationToken);

            return Unit.Value;
        }
    }
}
