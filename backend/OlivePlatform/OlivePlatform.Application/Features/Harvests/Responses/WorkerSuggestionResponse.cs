namespace OlivePlatform.Application.Features.Harvests.Responses;

// Ouvrier déjà saisi sur une ligne de coût.
public class WorkerSuggestionResponse
{
    public string WorkerName { get; set; } = null!;

    public string? WorkerIdentifier { get; set; }
}
