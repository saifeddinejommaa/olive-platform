using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Workers.Commands;

public class CreateWorkerCommand : IRequest<int>
{
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? WorkerType { get; set; }

    public decimal? DailyRate { get; set; }

    public bool IsActive { get; set; } = true;

    public string? Notes { get; set; }
}

public class CreateWorkerCommandHandler
    : IRequestHandler<CreateWorkerCommand, int>
{
    private readonly IWorkerRepository _repository;

    public CreateWorkerCommandHandler(
        IWorkerRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreateWorkerCommand request,
        CancellationToken cancellationToken)
    {
        var worker = new Worker
        {
            Code = request.Code,
            Name = request.Name,
            Phone = request.Phone,
            WorkerType = request.WorkerType,
            DailyRate = request.DailyRate,
            IsActive = request.IsActive,
        };

        await _repository.AddAsync(
            worker,
            cancellationToken);

        return worker.Id;
    }
}