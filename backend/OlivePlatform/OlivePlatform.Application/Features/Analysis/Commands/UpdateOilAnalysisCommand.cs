using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.OilAnalyses.Commands
{
    public class UpdateOilAnalysisCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public decimal? AcidityPercentage { get; set; }

        public decimal? PeroxideIndex { get; set; }

        public decimal? K232 { get; set; }

        public decimal? K270 { get; set; }

        public int? OrganolepticGrade { get; set; }

        public DateTime? PlannedDate { get; set; }
    }

    public class UpdateOilAnalysisCommandHandler
        : IRequestHandler<UpdateOilAnalysisCommand,Unit>
    {
        private readonly IOilAnalysisRepository _repository;

        public UpdateOilAnalysisCommandHandler(IOilAnalysisRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(
            UpdateOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var oilAnalysis = await _repository.GetByIdAsync(request.Id, cancellationToken);

            if (oilAnalysis is null)
            {
                throw new KeyNotFoundException(
                    $"Oil analysis {request.Id} not found.");
            }

            oilAnalysis.CreatedAt = DateTime.SpecifyKind(
                oilAnalysis.CreatedAt,
                DateTimeKind.Utc);

            oilAnalysis.AcidityPercentage = request.AcidityPercentage;
            oilAnalysis.PeroxideIndex = request.PeroxideIndex;
            oilAnalysis.K232 = request.K232;
            oilAnalysis.K270 = request.K270;
            oilAnalysis.OrganolepticGrade = request.OrganolepticGrade;
            if (request.PlannedDate.HasValue)
            {
                oilAnalysis.PlannedDate = request.PlannedDate.Value.ToUtc();
            }

            oilAnalysis.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(oilAnalysis, cancellationToken);

            return Unit.Value;
        }
    }
}