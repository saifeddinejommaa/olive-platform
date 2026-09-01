using Microsoft.EntityFrameworkCore;
using YourProject.Application.Services;

namespace OlivePlatform.Infrastructure.Services;

public class DocumentNumberService : IDocumentNumberService
{
    private readonly OlivePlatformAppDbContext _context;

    public DocumentNumberService(OlivePlatformAppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateAsync(
        string documentType,
        string prefix,
        int year,
        CancellationToken cancellationToken = default)
    {
        var connection = _context.Database.GetDbConnection();

        await using var command = connection.CreateCommand();

        command.CommandText = """
            INSERT INTO document_counters
                (document_type, year, last_number)
            VALUES
                (@document_type, @year, 1)
            ON CONFLICT (document_type, year)
            DO UPDATE SET
                last_number = document_counters.last_number + 1
            RETURNING last_number;
            """;

        var documentTypeParameter = command.CreateParameter();
        documentTypeParameter.ParameterName = "document_type";
        documentTypeParameter.Value = documentType;
        command.Parameters.Add(documentTypeParameter);

        var yearParameter = command.CreateParameter();
        yearParameter.ParameterName = "year";
        yearParameter.Value = year;
        command.Parameters.Add(yearParameter);

        if (connection.State != System.Data.ConnectionState.Open)
            await connection.OpenAsync(cancellationToken);

        var result = await command.ExecuteScalarAsync(cancellationToken);

        var lastNumber = Convert.ToInt32(result);

        return $"{prefix}-{year}-{lastNumber:D3}";
    }
}