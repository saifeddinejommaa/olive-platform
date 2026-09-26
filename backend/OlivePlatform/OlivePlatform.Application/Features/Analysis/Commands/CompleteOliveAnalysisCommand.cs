using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CompleteOliveAnalyseCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class CompleteOliveAnalyseCommandHandler
        : IRequestHandler<CompleteOliveAnalyseCommand, Unit>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISeasonService _seasonService;

        public CompleteOliveAnalyseCommandHandler(
            IOliveAnalysisRepository repository,
            IUnitOfWork unitOfWork,
            ISeasonService seasonService)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _seasonService = seasonService;
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

            await _seasonService.EnsureSeasonOpenAsync(
                existing.SeasonId,
                cancellationToken);

            var now = DateTime.UtcNow;

            existing.UpdatedAt = now;
            existing.EndTime = now;
            existing.Status = ProductionStatus.Completed;

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.UpdateAsync(existing, ct);
            }, cancellationToken);

            return Unit.Value;
        }
    }
}