namespace OlivePlatform.Application.Features.Seasons;

// Règle de la campagne oléicole : du 1er octobre au 30 septembre.
public static class SeasonCalendar
{
    public const int StartMonth = 10;

    public static int GetStartYear(DateOnly date) =>
        date.Month >= StartMonth ? date.Year : date.Year - 1;

    public static DateOnly GetStartDate(int startYear) =>
        new(startYear, StartMonth, 1);

    public static DateOnly GetEndDate(int startYear) =>
        GetStartDate(startYear + 1).AddDays(-1);

    public static string GetLabel(int startYear) =>
        $"{startYear}/{startYear + 1}";

    // Les dates sont stockées en UTC : on revient à la date locale
    // pour qu'un événement du 1er octobre à 00h00 tombe dans la bonne campagne.
    public static DateOnly ToBusinessDate(DateTime value)
    {
        var local = value.Kind == DateTimeKind.Utc
            ? value.ToLocalTime()
            : value;

        return DateOnly.FromDateTime(local);
    }
}
