using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Analysis.Commands
{
    public class CreateOliveAnalysisCommand : IRequest<int>
    {
        public int SourceTypeId { get; set; }
        public int SourceId { get; set; }
    }

    public class CreateOliveAnalysisCommandHandler
    : IRequestHandler<CreateOliveAnalysisCommand, int>
    {
        private readonly IOliveAnalysisRepository _repository;
        private readonly IDocumentNumberService _documentNumberService;

        private readonly IUnitOfWork _unitOfWork;

        public CreateOliveAnalysisCommandHandler(
            IOliveAnalysisRepository repository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _documentNumberService = documentNumberService;
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

            var operationNumber = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OliveAnalyse,
                    DocumentPrefixes.OliveAnalyse,
                    now.Year);

            var analysis = new OliveAnalysis
            {
                SourceType = (InputSourceType)request.SourceTypeId,
                SourceId = request.SourceId,
                Reference = operationNumber,
                CreatedAt = now,
            };

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                await _repository.AddAsync(analysis, cancellationToken);
            }, cancellationToken);

            return analysis.Id;
        }
    }
}
