using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilAnalyses.Commands
{
    public class CreateOilAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }

        public int SourceId { get; set; }

        public DateTime? AnalysisDate { get; set; }
    }

    public class CreateOilAnalysisCommandHandler
        : IRequestHandler<CreateOilAnalysisCommand, int>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOilAnalysisRepository _repository;
        private readonly IDocumentNumberService _documentNumberService;

        public CreateOilAnalysisCommandHandler(
            IOilAnalysisRepository repository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _documentNumberService = documentNumberService;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> Handle(
            CreateOilAnalysisCommand request,
            CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;

            var reference = await _documentNumberService.GenerateAsync(
                DocumentTypes.OilAnalysis,
                DocumentPrefixes.OilAnalysis,
                now.Year,
                cancellationToken);

            var oilAnalysis = new OilAnalysis
            {
                Reference = reference,
                SourceTypeId = (OilAnalysisSourceType)request.SourceTypeId,
                SourceId = request.SourceId,
                AnalysisDate = request.AnalysisDate.HasValue
                                ? DateTime.SpecifyKind(request.AnalysisDate.Value, DateTimeKind.Utc)
                                : null,
                CreatedAt = now,
                Status = ProductionStatus.Planned,
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.AddAsync(oilAnalysis, cancellationToken);
            }, cancellationToken);

            return oilAnalysis.Id;
        }
    }
}