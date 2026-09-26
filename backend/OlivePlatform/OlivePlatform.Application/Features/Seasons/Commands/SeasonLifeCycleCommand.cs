using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Seasons.Commands
{
    // ============================================================
    // CLOSE
    // ============================================================

    public class CloseSeasonCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class CloseSeasonCommandHandler
        : IRequestHandler<CloseSeasonCommand, Unit>
    {
        private readonly ISeasonRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public CloseSeasonCommandHandler(
            ISeasonRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
            CloseSeasonCommand request,
            CancellationToken cancellationToken)
        {
            var season = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (season is null)
            {
                throw new KeyNotFoundException(
                    $"Season with id '{request.Id}' was not found.");
            }

            if (season.Status == SeasonStatus.Closed)
            {
                throw new BusinessException(
                    "Cette campagne est déjà clôturée.");
            }

            var now = DateTime.UtcNow;

            season.Status = SeasonStatus.Closed;
            season.ClosedAt = now;
            season.UpdatedAt = now;

            await _repository.UpdateAsync(season, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

    // ============================================================
    // REOPEN
    // ============================================================

    public class ReopenSeasonCommand : IRequest<Unit>
    {
        public int Id { get; set; }
    }

    public class ReopenSeasonCommandHandler
        : IRequestHandler<ReopenSeasonCommand, Unit>
    {
        private readonly ISeasonRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public ReopenSeasonCommandHandler(
            ISeasonRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
            ReopenSeasonCommand request,
            CancellationToken cancellationToken)
        {
            var season = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            if (season is null)
            {
                throw new KeyNotFoundException(
                    $"Season with id '{request.Id}' was not found.");
            }

            if (season.Status == SeasonStatus.Open)
            {
                throw new BusinessException(
                    "Cette campagne est déjà ouverte.");
            }

            season.Status = SeasonStatus.Open;
            season.ClosedAt = null;
            season.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(season, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
