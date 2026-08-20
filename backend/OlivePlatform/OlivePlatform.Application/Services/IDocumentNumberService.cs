namespace YourProject.Application.Services;

public interface IDocumentNumberService
{
    Task<string> GenerateAsync(
        string documentType,
        string prefix,
        int year,
        CancellationToken cancellationToken = default);
}