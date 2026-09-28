using MediatR;
using OlivePlatform.Application.Services;

namespace OlivePlatform.Application.Features.OliveLots.Commands;

// « Passer sans analyse » : le lot devient pressable sans analyse terminée.
public class SkipOliveLotAnalysisCommand : IRequest<Unit>
{
    public long Id { get; set; }
}

public class SkipOliveLotAnalysisCommandHandler
    : IRequestHandler<SkipOliveLotAnalysisCommand, Unit>
{
    private readonly IOliveLotService _oliveLotService;

    public SkipOliveLotAnalysisCommandHandler(IOliveLotService oliveLotService)
    {
        _oliveLotService = oliveLotService;
    }

    public async Task<Unit> Handle(
        SkipOliveLotAnalysisCommand request,
        CancellationToken cancellationToken)
    {
        await _oliveLotService.SkipAnalysisAsync(request.Id, cancellationToken);

        return Unit.Value;
    }
}
