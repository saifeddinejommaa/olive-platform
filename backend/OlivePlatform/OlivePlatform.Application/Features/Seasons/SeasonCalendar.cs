using OlivePlatform.Domain;

namespace OlivePlatform.Application.Features.Seasons;

// Règle de la campagne oléicole : du 1er septembre au 31 août.
public static class SeasonCalendar
{
    public const int StartMonth = 9;

    public static int GetStartYear(DateOnly date) =>
        date.Month >= StartMonth ? date.Year : date.Year - 1;

    public static DateOnly GetStartDate(int startYear) =>
        new(startYear, StartMonth, 1);

    public static DateOnly GetEndDate(int startYear) =>
        GetStartDate(startYear + 1).AddDays(-1);

    // Récolte des olives : du début de campagne (septembre) à fin mars.
    public const int HarvestEndMonth = 3;

    public static bool IsInHarvestWindow(DateOnly date) =>
        date.Month >= StartMonth || date.Month <= HarvestEndMonth;

    public static void EnsureHarvestDate(DateOnly date)
    {
        if (!IsInHarvestWindow(date))
        {
            throw new BusinessException(
                "Une récolte ne peut être planifiée qu'entre le 1er septembre et le 31 mars.");
        }
    }

    public static string GetLabel(int startYear) =>
        $"{startYear}/{startYear + 1}";

    // Les dates sont stockées en UTC : on revient à la date locale
    // pour qu'un événement du 1er septembre à 00h00 tombe dans la bonne campagne.
    public static DateOnly ToBusinessDate(DateTime value)
    {
        var local = value.Kind == DateTimeKind.Utc
            ? value.ToLocalTime()
            : value;

        return DateOnly.FromDateTime(local);
    }
}
