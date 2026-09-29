using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Production.Commands
{
    public class ClosePressingOperationCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        // Huile produite (L), décimale.
        public decimal OilQuantity { get; set; }

        // Citerne tampon qui reçoit l'huile en attendant son analyse.
        public int? BufferTankId { get; set; }
    }

    public class ClosePressingOperationCommandHandler
    : IRequestHandler<ClosePressingOperationCommand, Unit>
    {

        private readonly IPressingOperationsRepository _repository;
        private readonly IPressingOperationInputsRepository _inputsRepository;
        private readonly ISeasonService _seasonService;
        private readonly IOliveLotService _oliveLotService;
        private readonly IPressingParametersRepository _parametersRepository;
        private readonly ITankRepository _tankRepository;
        private readonly IOilBatchRepository _oilBatchRepository;
        private readonly IOilMovementRepository _oilMovementRepository;
        private readonly IOilAnalysisRepository _oilAnalysisRepository;
        private readonly IDocumentNumberService _documentNumberService;
        private readonly IUnitOfWork _unitOfWork;

        public ClosePressingOperationCommandHandler(
            IPressingOperationsRepository repository,
            IPressingOperationInputsRepository inputsRepository,
            ISeasonService seasonService,
            IOliveLotService oliveLotService,
            IPressingParametersRepository parametersRepository,
            ITankRepository tankRepository,
            IOilBatchRepository oilBatchRepository,
            IOilMovementRepository oilMovementRepository,
            IOilAnalysisRepository oilAnalysisRepository,
            IDocumentNumberService documentNumberService,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _inputsRepository = inputsRepository;
            _seasonService = seasonService;
            _oliveLotService = oliveLotService;
            _parametersRepository = parametersRepository;
            _tankRepository = tankRepository;
            _oilBatchRepository = oilBatchRepository;
            _oilMovementRepository = oilMovementRepository;
            _oilAnalysisRepository = oilAnalysisRepository;
            _documentNumberService = documentNumberService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(
    ClosePressingOperationCommand request,
    CancellationToken cancellationToken)
        {
            var pressingOperation = await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

            var now = DateTime.UtcNow;

            if (pressingOperation is null)
            {
                throw new KeyNotFoundException(
                    $"Pressing operation {request.Id} not found.");
            }

            await _seasonService.EnsureSeasonOpenAsync(
                pressingOperation.SeasonId,
                cancellationToken);

            // Une pression ne se clôture qu'avec sa configuration renseignée.
            var parameters = await _parametersRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            if (parameters is null || !parameters.HasAnyValue())
            {
                throw new BusinessException(
                    "La configuration de pression est obligatoire avant de clôturer la pression.");
            }

            if (pressingOperation.Status != ProductionStatus.InProgress)
            {
                throw new BusinessException(
                    "Seule une pression en cours peut être clôturée.");
            }

            if (request.OilQuantity <= 0)
            {
                throw new BusinessException(
                    "Veuillez renseigner une quantité d'huile produite valide.");
            }

            var bufferTank = await GetBufferTankAsync(request, cancellationToken);

            var inputs = await _inputsRepository.GetByPressingOperationIdAsync(
                request.Id,
                cancellationToken);

            // Garde-fou : aucun lot ne doit attendre son analyse.
            await _oliveLotService.EnsureLotsAnalysedAsync(
                inputs.Select(input => input.LotId),
                cancellationToken);

            await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                // Les lots entièrement pressés sont vidés.
                await _oliveLotService.CompleteAsync(inputs, ct);

                foreach (var input in inputs)
                {
                    input.Status = PressingOperationInputStatus.Consumed;

                    await _inputsRepository.UpdateAsync(
                        input,
                        ct);
                }

                pressingOperation.EndTime = now;
                pressingOperation.OilQuantityLiters = request.OilQuantity;
                pressingOperation.Status = ProductionStatus.Completed;
                pressingOperation.OilYieldDeviationLiters = pressingOperation.ExpectedOilLiters is not null
                    ? request.OilQuantity - pressingOperation.ExpectedOilLiters
                    : null;

                await _repository.UpdateAsync(
                    pressingOperation,
                    ct);

                await StoreInBufferTankAsync(pressingOperation, bufferTank, request.OilQuantity, now, ct);

                await PlanOilAnalysisAsync(pressingOperation, now, ct);
            }, cancellationToken);

            return Unit.Value;
        }

        // Citerne tampon : active, vide (une seule pression par tampon) et assez grande.
        private async Task<Tank> GetBufferTankAsync(
            ClosePressingOperationCommand request,
            CancellationToken cancellationToken)
        {
            if (request.BufferTankId is null)
            {
                throw new BusinessException(
                    "Choisissez la citerne tampon qui reçoit l'huile de la pression.");
            }

            var tank = await _tankRepository.GetByIdAsync(
                request.BufferTankId.Value,
                cancellationToken);

            if (tank is null || !tank.IsBuffer || tank.Status != "active")
            {
                throw new BusinessException(
                    "La citerne choisie n'est pas une citerne tampon active.");
            }

            var currentQuantity = await _tankRepository.GetCurrentQuantityAsync(
                tank.Id,
                cancellationToken);

            if (currentQuantity > 0)
            {
                throw new BusinessException(
                    $"La citerne tampon {tank.Code} n'est pas vide : transférez d'abord son huile.");
            }

            if (tank.CapacityLiters < request.OilQuantity)
            {
                throw new BusinessException(
                    $"La citerne tampon {tank.Code} ({tank.CapacityLiters:0.#} L) est trop petite pour {request.OilQuantity:0.#} L.");
            }

            return tank;
        }

        // L'huile produite devient un lot d'huile, versé dans la citerne tampon.
        private async Task StoreInBufferTankAsync(
            PressingOperation pressingOperation,
            Tank bufferTank,
            decimal oilQuantity,
            DateTime now,
            CancellationToken cancellationToken)
        {
            var batch = new OilBatch
            {
                BatchNumber = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OilBatch,
                    DocumentPrefixes.OilBatch,
                    now.Year,
                    cancellationToken),
                ProductionBatchId = pressingOperation.Id,
                ProductionDate = DateOnly.FromDateTime(now),
                QuantityLiters = oilQuantity,
                Status = OilBatch.PendingAnalysisStatus,
            };

            await _oilBatchRepository.AddAsync(batch, cancellationToken);

            // L'Id du lot est nécessaire pour le mouvement.
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var movement = new OilMovement
            {
                MovementNumber = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OilMovement,
                    DocumentPrefixes.OilMovement,
                    now.Year,
                    cancellationToken),
                MovementType = OilMovementType.ProductionIn,
                MovementDate = now,
                OilBatchId = batch.Id,
                DestinationTankId = bufferTank.Id,
                QuantityLiters = oilQuantity,
            };

            await _oilMovementRepository.AddAsync(movement, cancellationToken);
        }

        // Analyse d'huile planifiée : c'est elle qui décidera de la citerne de stockage.
        private async Task PlanOilAnalysisAsync(
            PressingOperation pressingOperation,
            DateTime now,
            CancellationToken cancellationToken)
        {
            var existing = await _oilAnalysisRepository.GetBySourceAsync(
                (int)OilAnalysisSourceType.PressingOperation,
                pressingOperation.Id,
                cancellationToken);

            if (existing is not null)
            {
                return;
            }

            var analysis = new OilAnalysis
            {
                Reference = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OilAnalysis,
                    DocumentPrefixes.OilAnalysis,
                    now.Year,
                    cancellationToken),
                SeasonId = pressingOperation.SeasonId,
                SourceTypeId = OilAnalysisSourceType.PressingOperation,
                SourceId = pressingOperation.Id,
                PlannedDate = now,
                CreatedAt = now,
                Status = ProductionStatus.Planned,
            };

            await _oilAnalysisRepository.AddAsync(analysis, cancellationToken);
        }
    }
}
