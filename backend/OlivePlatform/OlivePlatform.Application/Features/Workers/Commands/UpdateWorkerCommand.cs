using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Workers.Commands;

public class UpdateWorkerCommand : IRequest<bool>
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? WorkerType { get; set; }

    public decimal? DailyRate { get; set; }

    public bool IsActive { get; set; }
}

public class UpdateWorkerCommandHandler
    : IRequestHandler<UpdateWorkerCommand, bool>
{
    private readonly IWorkerRepository _repository;

    public UpdateWorkerCommandHandler(
        IWorkerRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdateWorkerCommand request,
        CancellationToken cancellationToken)
    {
        var worker = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (worker is null)
            return false;

        worker.Code = request.Code;
        worker.Name = request.Name;
        worker.Phone = request.Phone;
        worker.WorkerType = request.WorkerType;
        worker.DailyRate = request.DailyRate;
        worker.IsActive = request.IsActive;

        await _repository.UpdateAsync(
            worker,
            cancellationToken);

        return true;
    }
}